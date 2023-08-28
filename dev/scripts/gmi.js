/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

/* eslint-disable */
var GMI = function (options, embedVars, gameDir) {
	var appName = embedVars.statsAppName;
	var counterName = embedVars.statsCounterName;
	var gameId = "local-id";
	var containerId = "local-game-holder";
	var url = "";
	var env = "test";
	var debugMode = getParam("debug") || false;

	Object.defineProperty(GMI.prototype, "embedVars", {
		get: function () {
			return embedVars;
		},
	});
	Object.defineProperty(GMI.prototype, "gameContainerId", {
		get: function () {
			return containerId;
		},
	});
	Object.defineProperty(GMI.prototype, "gameUrl", {
		get: function () {
			return url;
		},
	});
	Object.defineProperty(GMI.prototype, "gameDir", {
		get: function () {
			return gameDir;
		},
	});
	Object.defineProperty(GMI.prototype, "info", {
		get: function () {
			return { gameDir };
		},
	});
	Object.defineProperty(GMI.prototype, "environment", {
		get: function () {
			return env;
		},
	});
	Object.defineProperty(GMI.prototype, "shouldShowExitButton", {
		get: function () {
			return getParam("hideExit") ? false : window.self === window.top;
		},
	});
	Object.defineProperty(GMI.prototype, "shouldDisplayMuteButton", {
		get: function () {
			return getParam("hideMute") ? false : true;
		},
	});
	Object.defineProperty(GMI.prototype, "shouldLongPressForSettings", {
		get: function () {
			return false;
		},
	});

	var GMI_LOCAL_STORAGE_KEY = "bbc_childrens_gmi_data";
	var GMI_GAME_STORAGE_KEY = GMI_LOCAL_STORAGE_KEY + "_" + gameId;
	var globalSettings = {
		audio: true,
		subtitles: false,
		motion: true,
		achievements: [],
	};
	var gameSettings = {};
	var staticAchievementList = [];
	function parseLocalStorage(key) {
		var data = window.localStorage.getItem(key);
		try {
			return JSON.parse(data);
		} catch (e) {}
		return undefined;
	}
	function loadLocalData() {
		function getDefaultSettings() {
			var defaults = {};
			defaults.audio = true;
			defaults.subtitles = false;
			defaults.motion = true;
			return defaults;
		}
		function ensureGlobalSettingsAreBools() {
			globalSettings.audio = !!globalSettings.audio;
			globalSettings.subtitles = !!globalSettings.subtitles;
			globalSettings.motion = !globalSettings.hasOwnProperty("motion") || globalSettings.motion;
		}

		globalSettings = parseLocalStorage(GMI_LOCAL_STORAGE_KEY) || getDefaultSettings();
		ensureGlobalSettingsAreBools();
		gameSettings = parseLocalStorage(GMI_GAME_STORAGE_KEY) || {};
	}
	function saveGlobalSettings() {
		try {
			window.localStorage.setItem(GMI_LOCAL_STORAGE_KEY, JSON.stringify(globalSettings));
		} catch (e) {}
	}
	GMI.prototype.getAllSettings = function () {
		var settings = JSON.parse(JSON.stringify(globalSettings)); //Prevents reference assignment
		settings.gameData = gameSettings;
		return settings;
	};
	GMI.prototype.setGameData = function (key, value) {
		gameSettings[key] = value;
		// In Safari Private browsing mode on OSX and iOS localStorage is read only, and will throw
		// QuotaExceededError if an attempt to call setItem is made
		try {
			window.localStorage.setItem(GMI_GAME_STORAGE_KEY, JSON.stringify(gameSettings));
		} catch (e) {}
	};
	GMI.prototype.setAudio = function (state) {
		globalSettings.audio = !!state;
		saveGlobalSettings();
	};
	GMI.prototype.setSubtitles = function (state) {
		globalSettings.subtitles = !!state;
		saveGlobalSettings();
	};
	GMI.prototype.setMotion = function (state) {
		globalSettings.motion = !!state;
		saveGlobalSettings();
	};
	GMI.prototype.showPrompt = function (resumeGame) {
		resumeGame();
		return false;
	};
	GMI.prototype.showSettings = function (onSettingsChanged, onSettingsClosed) {
		var settingsDiv = document.getElementsByClassName("settings");
		if (!(settingsDiv && settingsDiv[0])) {
			GMI.prototype.sendStatsEvent("settings", "open", {});
			var settings = document.createElement("div");
			settings.className = "settings";
			settings.innerHTML +=
				"The settings screen will appear here when the game is hosted on the BBC servers <br />";

			var settingsCheckbox = document.createElement("input");
			settingsCheckbox.type = "checkbox";
			settingsCheckbox.name = "settings-changed";

			var settingsLabel = document.createElement("label");
			settingsLabel.innerText = "Trigger settings change event";
			settingsLabel.htmlFor = "settings-changed";

			var settingsCloseButton = document.createElement("input");
			settingsCloseButton.type = "button";
			settingsCloseButton.value = "Click here to close settings.";

			var settingsForm = document.createElement("form");
			settingsForm.appendChild(settingsCheckbox);
			settingsForm.appendChild(settingsLabel);
			settingsForm.appendChild(settingsCloseButton);

			settings.appendChild(settingsForm);

			settingsCheckbox.addEventListener("change", function () {
				onSettingsChanged("settings-changed", settingsCheckbox.value);
			});

			settingsCloseButton.addEventListener("click", function () {
				onSettingsClosed();
				document.body.removeChild(settings);
			});
			document.body.appendChild(settings);
		}
		return true;
	};
	GMI.prototype.setStatsScreen = function (screenName, params) {
		if (debugMode) {
			var paramsString = params ? "with params: " + JSON.stringify(params) : "";
			console.log("Stats screen set to " + screenName + " " + paramsString); // eslint-disable-line no-console
		}
	};
	GMI.prototype.sendStatsEvent = function (name, type, params) {
		if (debugMode) {
			console.log("Stat fired - name: " + name + ", type: " + type + ", params: " + JSON.stringify(params));
		}
	};
	GMI.prototype.exit = function () {
		window.open("http://www.bbc.co.uk", "_top");
	};
	GMI.prototype.debug = function (message) {
		console.log(message);
	};
	GMI.prototype.achievements = {};

	var isAchieved = function (config, stored) {
		var hasProgress = Boolean(config && config.maxProgress);
		var fullProgress = Boolean(stored && config && stored.progress >= config.maxProgress);

		return (stored && !hasProgress) || (hasProgress && fullProgress);
	};

	var save = function (stored, update) {
		if (!stored) {
			globalSettings.achievements.push(update);
			debugMode && console.log("CREATE LOCAL DATA:", update);
		} else {
			Object.assign(stored, update);
			debugMode && console.log("UPDATE LOCAL DATA: ", stored, " -- TO: ", update);
		}
		GMI.prototype.setGameData("achievements", globalSettings.achievements);
	};

	GMI.prototype.achievements.show = function () {
		var achievementsDiv = document.getElementsByClassName("achievements");
		if (!(achievementsDiv && achievementsDiv[0])) {
			GMI.prototype.sendStatsEvent("achievements", "open", {});
			var achievementsDiv = document.createElement("div");
			achievementsDiv.className = "achievements";
			achievementsDiv.innerHTML +=
				"The achievements screen will appear here when the game is hosted on the BBC servers <br />";

			var achievements = GMI.prototype.achievements.get();

			var achievementsContainer = document.createElement("div");
			achievementsContainer.className = "achievements-container";

			for (var i = 0; i < achievements.length; i++) {
				var achievementBox = document.createElement("details");
				var achievementName = document.createElement("summary");
				var achievementDesc = document.createElement("p");
				var achievementStatus = document.createElement("p");

				achievementName.innerHTML = achievements[i].name;
				achievementDesc.innerHTML = "Description: " + achievements[i].description;
				achievementStatus.innerHTML = "Achieved: " + (achievements[i].achieved ? "&#9989;" : "&#10062;");

				achievementBox.appendChild(achievementName);
				achievementBox.appendChild(achievementStatus);
				achievementBox.appendChild(achievementDesc);
				achievementsContainer.appendChild(achievementBox);
			}

			achievementsDiv.appendChild(achievementsContainer);

			var achievementsCloseButton = document.createElement("input");
			achievementsCloseButton.type = "button";
			achievementsCloseButton.value = "Click here to close.";

			achievementsDiv.appendChild(achievementsCloseButton);

			achievementsCloseButton.addEventListener("click", function () {
				document.body.removeChild(achievementsDiv);
			});
			document.body.appendChild(achievementsDiv);
			return true;
		}
		return false;
	};
	GMI.prototype.achievements.init = function (init, callback) {
		if (debugMode) {
			console.log("Init achievements: ", init, " callback: ", callback);
		}
		staticAchievementList = init;
		if (callback !== undefined) {
			callback();
		}
	};
	GMI.prototype.achievements.get = function () {
		if (globalSettings.achievements === undefined) {
			globalSettings.achievements = [];

			saveGlobalSettings();
		}
		var output = staticAchievementList.map(function (config) {
			var stored = globalSettings.achievements.find(function (unlocked) {
				return unlocked.key === config.key;
			});
			return Object.assign(config, stored, { achieved: isAchieved(config, stored) });
		});
		debugMode && console.log(output);
		return output;
	};
	GMI.prototype.achievements.set = function (update) {
		if (globalSettings.achievements === undefined) {
			globalSettings.achievements = [];

			saveGlobalSettings();
		}
		var config = staticAchievementList.find(function (achievement) {
			return update.key === achievement.key;
		});
		var stored = globalSettings.achievements.find(function (unlocked) {
			return unlocked.key === update.key;
		});
		var alreadyAchieved = isAchieved(config, stored);
		var achievedOnUpdate = isAchieved(config, update);

		if (!config || alreadyAchieved) {
			return false;
		}

		save(stored, update);

		debugMode && console.log("NOTIFY: ", achievedOnUpdate, update.key);
		return achievedOnUpdate;
	};
	GMI.prototype.gameLoaded = function () {};
	loadLocalData();
	GMI.prototype = Object.create(GMI.prototype);
};

function configureGmi(gameDir, themesDir) {
	var gmi_instance;
	var theme = getParam("theme") || "default";
	var embedVars = {
		statsCounterName: "testCounterName",
		statsAppName: "TestAppName",
		configPath: themesDir + theme + "/",
	};

	window.getGMI = function (options) {
		if (gmi_instance) {
			console.warn("Attempted to create multiple copies of the GMI. Only a single instance should be created");
		}
		gmi_instance = new GMI(options, embedVars, gameDir);
		return gmi_instance;
	};
}

function getParam(name) {
	var re = new RegExp(name + "=([^&]*)", "g");
	var match = re.exec(document.location.search);
	return match ? match[1] : null;
}

configureGmi("", "themes/");
