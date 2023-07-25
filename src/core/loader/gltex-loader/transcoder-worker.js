/**
 * This wraps the transcoder web-worker functionality; it can be converted into a string to get the source code. It expects
 * you to prepend the transcoder JavaScript code so that the `BASIS` namespace is available.
 *
 * The transcoder worker responds to two types of messages: "init" and "transcode". You must always send the first "init"
 * {@link IInitializeTranscoderMessage} message with the WebAssembly binary; if the transcoder is successfully initialized,
 * the web-worker will respond by sending another {@link ITranscodeResponse} message with `success: true`.
 * @ignore
 */
import { Runner } from "./runner.js";


function TranscoderWorkerWrapper() {
	var basisBinding;
	var messageHandlers = {
		init: function (message) {
			if (!self.BASIS) {
				console.warn('jsSource was not prepended?');
				return {
					type: 'init',
					success: false
				};
			}
			self.BASIS({ wasmBinary: message.wasmSource }).then(function (basisLibrary) {
				basisLibrary.initializeBasis();
				basisBinding = basisLibrary;
				self.postMessage({
					type: 'init',
					success: true
				});
			});
			return null;
		},
		transcode: function (message) {
			var basisData = message.basisData;
			var BASIS = basisBinding;
			var data = basisData;
			var basisFile = new BASIS.BasisFile(data);
			var imageCount = basisFile.getNumImages();
			var hasAlpha = basisFile.getHasAlpha();
			var basisFormat = hasAlpha
				? message.rgbaFormat
				: message.rgbFormat;
			var basisFallbackFormat = 14; // BASIS_FORMATS.cTFRGB565 (cannot import values into web-worker!)
			var imageArray = new Array(imageCount);
			var fallbackMode = false;
			if (!basisFile.startTranscoding()) {
				basisFile.close();
				basisFile.delete();
				return {
					type: 'transcode',
					requestID: message.requestID,
					success: false,
					imageArray: null
				};
			}
			for (var i = 0; i < imageCount; i++) {
				var levels = basisFile.getNumLevels(i);
				var imageResource = {
					imageID: i,
					levelArray: new Array(),
					width: null,
					height: null
				};
				for (var j = 0; j < levels; j++) {
					var format = !fallbackMode ? basisFormat : basisFallbackFormat;
					var width = basisFile.getImageWidth(i, j);
					var height = basisFile.getImageHeight(i, j);
					var byteSize = basisFile.getImageTranscodedSizeInBytes(i, j, format);
					var alignedWidth = (width + 3) & ~3;
					var alignedHeight = (height + 3) & ~3;
					// Level 0 is texture's actual width, height
					if (j === 0) {
						imageResource.width = alignedWidth;
						imageResource.height = alignedHeight;
					}
					var imageBuffer = new Uint8Array(byteSize);
					if (!basisFile.transcodeImage(imageBuffer, i, j, format, false, false)) {
						if (fallbackMode) {
							// We failed in fallback mode as well!
							console.error("Basis failed to transcode image " + i + ", level " + j + "!");
							return { type: 'transcode', requestID: message.requestID, success: false };
						}
						/* eslint-disable-next-line max-len */
						console.warn("Basis failed to transcode image " + i + ", level " + j + "! Retrying to an uncompressed texture format!");
						i = -1;
						fallbackMode = true;
						break;
					}
					imageResource.levelArray.push({
						levelID: j,
						levelWidth: width,
						levelHeight: height,
						levelBuffer: imageBuffer
					});
				}
				imageArray[i] = imageResource;
			}
			basisFile.close();
			basisFile.delete();
			return {
				type: 'transcode',
				requestID: message.requestID,
				success: true,
				basisFormat: !fallbackMode ? basisFormat : basisFallbackFormat,
				imageArray: imageArray
			};
		}
	};
	self.onmessage = function (e) {
		var msg = e.data;
		var response = messageHandlers[msg.type](msg);
		if (response) {
			self.postMessage(response);
		}
	};
}


/**
 * Worker class for transcoding *.basis files in background threads.
 *
 * To enable asynchronous transcoding, you need to provide the URL to the basis_universal transcoding
 * library.
 * @memberof PIXI.BasisLoader
 */
export const TranscoderWorker = /** @class */ (function () {
	function TranscoderWorker() {
		var _this = this;
		this.requests = {};
		/**
		 * Handles responses from the web-worker
		 * @param e - a message event containing the transcoded response
		 */
		this.onMessage = function (e) {
			var data = e.data;
			if (data.type === 'init') {
				if (!data.success) {
					throw new Error('BasisResource.TranscoderWorker failed to initialize.');
				}
				_this.isInit = true;
				_this.onInit();
			}
			else if (data.type === 'transcode') {
				--_this.load;
				var requestID = data.requestID;
				if (data.success) {
					_this.requests[requestID].resolve(data);
				}
				else {
					_this.requests[requestID].reject();
				}
				delete _this.requests[requestID];
			}
		};
		this.isInit = false;
		this.load = 0;
		this.initPromise = new Promise(function (resolve) { _this.onInit = resolve; });
		if (!TranscoderWorker.wasmSource) {
			console.warn('PIXI.resources.BasisResource.TranscoderWorker has not been given the transcoder WASM binary!');
		}
		this.worker = new Worker(TranscoderWorker.workerURL);
		this.worker.onmessage = this.onMessage;
		this.worker.postMessage({
			type: 'init',
			jsSource: TranscoderWorker.jsSource,
			wasmSource: TranscoderWorker.wasmSource
		});
	}
	Object.defineProperty(TranscoderWorker, "workerURL", {
		/** Generated URL for the transcoder worker script. */
		get: function () {
			if (!TranscoderWorker._workerURL) {
				var workerSource = TranscoderWorkerWrapper.toString();
				var beginIndex = workerSource.indexOf('{');
				var endIndex = workerSource.lastIndexOf('}');
				workerSource = workerSource.slice(beginIndex + 1, endIndex);
				if (TranscoderWorker.jsSource) {
					workerSource = TranscoderWorker.jsSource + "\n" + workerSource;
				}
				TranscoderWorker._workerURL = URL.createObjectURL(new Blob([workerSource]));
			}
			return TranscoderWorker._workerURL;
		},
		enumerable: false,
		configurable: true
	});
	/** @returns a promise that is resolved when the web-worker is initialized */
	TranscoderWorker.prototype.initAsync = function () {
		return this.initPromise;
	};
	/**
	 * Creates a promise that will resolve when the transcoding of a *.basis file is complete.
	 * @param basisData - *.basis file contents
	 * @param rgbaFormat - transcoding format for RGBA files
	 * @param rgbFormat - transcoding format for RGB files
	 * @returns a promise that is resolved with the transcoding response of the web-worker
	 */
	TranscoderWorker.prototype.transcodeAsync = function (basisData, rgbaFormat, rgbFormat) {
		return __awaiter(this, void 0, Promise, function () {
			var requestID, requestPromise;
			var _this = this;
			return __generator(this, function (_a) {
				++this.load;
				requestID = TranscoderWorker._tempID++;
				requestPromise = new Promise(function (resolve, reject) {
					_this.requests[requestID] = {
						resolve: resolve,
						reject: reject
					};
				});
				this.worker.postMessage({
					requestID: requestID,
					basisData: basisData,
					rgbaFormat: rgbaFormat,
					rgbFormat: rgbFormat,
					type: 'transcode'
				});
				return [2 /*return*/, requestPromise];
			});
		});
	};
	/**
	 * Loads the transcoder source code
	 * @param jsURL - URL to the javascript basis transcoder
	 * @param wasmURL - URL to the wasm basis transcoder
	 * @returns A promise that resolves when both the js and wasm transcoders have been loaded.
	 */
	TranscoderWorker.loadTranscoder = function (jsURL, wasmURL) {
		var jsPromise = fetch(jsURL)
			.then(res => res.text())
			.then(function (text) { TranscoderWorker.jsSource = text; });
		var wasmPromise = fetch(wasmURL)
			.then(function (res) { return res.arrayBuffer(); })
			.then(function (arrayBuffer) { TranscoderWorker.wasmSource = arrayBuffer; });
		return Promise.all([jsPromise, wasmPromise]).then(function (data) {
			TranscoderWorker.onTranscoderInitialized.emit();
			return data;
		});
	};
	/**
	 * Set the transcoder source code directly
	 * @param jsSource - source for the javascript basis transcoder
	 * @param wasmSource - source for the wasm basis transcoder
	 */
	TranscoderWorker.setTranscoder = function (jsSource, wasmSource) {
		TranscoderWorker.jsSource = jsSource;
		TranscoderWorker.wasmSource = wasmSource;
	};
	TranscoderWorker.onTranscoderInitialized = new Runner('onTranscoderInitialized');
	TranscoderWorker._tempID = 0;
	return TranscoderWorker;
}());

