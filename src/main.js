/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Home } from "./components/home.js";
import { Narrative } from "./components/narrative.js";
import { Results } from "./components/results/results-screen.js";
import { Select } from "./components/select/select-screen.js";
import { Shop } from "./components/shop/shop.js";
import { HowToPlay } from "./components/how-to-play.js";
import { Game } from "./components/game.js";
import { Pause } from "./components/overlays/pause.js";
import { settingsChannel } from "./core/settings.js";
import { eventBus } from "./core/event-bus.js";
import { startup } from "./core/startup.js";

// Setup for BBC settings control
const settings = {
	pages: [
		{
			title: "Custom Settings",
			settings: [
				{
					key: "custom1",
					type: "toggle",
					title: "Custom setting",
					description: "Description of custom setting",
				},
			],
		},
	],
};

//Example of responding to custom game settings
eventBus.subscribe({
	channel: settingsChannel,
	name: "custom1",
	callback: value => {
		console.log("Custom 1 setting changed to " + value); // eslint-disable-line no-console
	},
});

// Additional game options passed to phaser setup
const gameOptions = {
	//pixelArt: true,
};

const screens = {
	home: {
		scene: Home,
		routes: {
			debug: "debug",
			//Example of custom routing function
			next: scene => {
				scene.navigate("game");
			},
		},
		default: true,
	},
	narrative: {
		scene: Narrative,
		routes: {
			next: "character-select",
		},
	},
	"character-select": {
		scene: Select,
		routes: {
			next: "level-select",
			home: "home",
		},
	},
	"level-select": {
		scene: Select,
		routes: {
			next: "game",
			home: "home",
		},
	},
	game: {
		scene: Game,
		settings: {
			physics: {
				default: "arcade",
				arcade: {},
			},
		},
		routes: {
			next: "results",
			home: "home",
			restart: "game",
		},
	},
	results: {
		scene: Results,
		routes: {
			continue: "level-select",
			restart: "game",
			home: "home",
		},
	},
	...Shop({ key: "shop", routes: {} }),
	// Overlays
	"how-to-play": {
		scene: HowToPlay,
		routes: {
			home: "home",
		},
	},
	pause: {
		scene: Pause,
		routes: {
			home: "home",
			select: "character-select",
		},
	},
};

startup({ screens, settings, gameOptions });
