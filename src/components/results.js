/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";
import { gmi } from "../core/gmi/gmi.js";

export class Results extends Screen {
    constructor() {
        super();
    }

    fireGameCompleteStat(result) {
        const score = parseInt(result);
        const scoreMetaData = score ? `SCO=[${score}]` : undefined;
        gmi.sendStatsEvent("score", "display", scoreMetaData);
    }

    create() {
        const theme = this.context.config.theme[this.game.state.current];

        const backgroundImage = this.game.add.image(0, 0, "results.background");
        this.scene.addToBackground(backgroundImage);

        const titleImage = this.scene.addToBackground(this.game.add.image(0, -150, "results.title"));
        this.scene.addToBackground(titleImage);

        const resultsText = this.game.add.text(0, 50, this.transientData.results, theme.resultText.style);
        this.scene.addToBackground(resultsText);

        // TODO the following line should be added back once the overlap issue is resolved NT:04:02:19
        const showAchievements = false; //!!this.context.config.theme.game.achievements;
        const defaultButtons = ["pause", "restart", "continueGame"];
        const buttons = showAchievements ? defaultButtons.concat("achievements") : defaultButtons;

        this.scene.addLayout(buttons);
        createTestHarnessDisplay(this.game, this.context, this.scene);

        this.fireGameCompleteStat(this.transientData.results);

        signal.bus.subscribe({
            name: "continue",
            channel: buttonsChannel,
            callback: () => {
                this.navigation.next();
            },
        });

        signal.bus.subscribe({
            name: "restart",
            channel: buttonsChannel,
            callback: () => {
                this.navigation.game(this.transientData);
            },
        });
    }
}
