/**
 * FontFile is a file type for loading fonts using the Phaser.Loader
 *
 * @module components/loader/font-loader/font-file
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
class FontFile extends Phaser.Loader.File {
	constructor(loader, fileConfig) {
		super(loader, Object.assign(fileConfig, { type: "webfont" }));
	}

	load() {
		this.config.custom &&
			(this.config.custom.urls = this.config.custom.urls.map(url =>
				Phaser.Loader.GetURL({ url }, this.loader.baseURL.concat(this.loader.path)),
			));
		WebFont.load({
			...this.config,
			active: this.onLoad.bind(this),
			inactive: this.onError.bind(this),
			fontactive: this.onFontActive.bind(this),
			fontinactive: this.onFontInactive.bind(this),
		});
	}

	onLoad() {
		this.loader.nextFile(this, true);
	}

	onError() {
		this.loader.nextFile(this, false);
	}

	onFontActive(fontFamily, fontVariationDescription) {
		this.loader.emit("fontactive", this, { fontFamily, fontVariationDescription });
	}

	onFontInactive(fontFamily, fontVariationDescription) {
		this.loader.emit("fontinactive", this, { fontFamily, fontVariationDescription });
	}
}

export default FontFile;
