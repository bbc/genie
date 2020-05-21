/**
 * Narrative screens are used to relay information.
 *
 * @module components/narrative
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../lib/lodash/fp/fp.js";
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import { eventBus } from "../core/event-bus.js";
//import { accessibilify } from "../core/accessibility/accessibilify.js";

/*
    TODO - just leaving this here in case the continue button needs setting to a specific x y - might be useful.
        This is how the example page works although it might not worj with breakpoints.
 */
//const addContinueButton = scene => {
//    const button = scene.add.gelButton(0, 0, {
//        scene: "gelDebug",
//        key: "button",
//        id: "Config",
//        channel: buttonsChannel(scene),
//        gameButton: true,
//        ariaLabel: "Continue",
//    });
//    const text = scene.add.text(0, 0, "Continue").setOrigin(0.5, 0.5);
//    button.overlays.set("text", text);
//    accessibilify(button, true);
//
//    eventBus.subscribe({
//        channel: buttonsChannel(config.scene),
//        name: config.id,
//        callback: config.callback,
//    });
//};

//const continueNarrative = () => {
//console.log("NEXT PAGE")

/*
        TODO
            * Is there always a continue button?
            * need access to next page button (Phaser gameobject names?)
     */
//}

/*
    TODO
        * Named animations in Spine
        * Doc this https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tween/
        * Should auto continue be a thing?
        * Should continue flash be a thing?
        * Remove continue button click audio?
        * Inline text styles? https://rexrainbow.github.io/phaser3-rex-notes/docs/site/tagtext/
        * BB Code text? https://rexrainbow.github.io/phaser3-rex-notes/docs/site/bbcodetext/
        * Typing text? https://rexrainbow.github.io/phaser3-rex-notes/docs/site/texttyping/
        * speech Bubbles: https://phaser.io/examples/v3/view/game-objects/text/static/speech-bubble
        * play named spine anims
        * Initial state for tweens or start tween?
*/

/*
    tweens: [{
        name: "fadeIn",
        targets: ["text1"],
        alpha: { from: 0, to: 1 },
        ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 1000,
    }],
*/

const nextPage = scene => () => {
    scene.currentPage++;

    if (scene.currentPage >= scene.context.theme.background.pages.length) {
        scene.navigation.next()
    }

    startPage(scene);
};

const isAudio = scene => name => Boolean(scene.context.theme.background.audio.find(a => a.name === name));
const playAudio = scene => name => {
    const config = scene.context.theme.background.audio.find(a => a.name === name);
    scene.sound.play(config.key);
};

const isTween = scene => name => Boolean(scene.context.theme.background.tweens.find(a => a.name === name));

const createTween = scene => name => {
    const config = scene.context.theme.background.tweens.find(a => a.name === name);

    config.targets = config.targets.map(scene.children.getByName, scene.children);

    //TODO HACK - circumvents Phaser bug
    const names = config.targets.map(n => n.name)
    config.onComplete = () => {
        config.targets.forEach((target, idx) => {
            target.name = names[idx]
        })
    }


    scene.tweens.add(config);

    setTimeout(() => {console.log("delayed", config.targets[0].name)}, 100)
};

const startPage = scene => {
    const pages = scene.context.theme.background.pages;


    //TODO maybe this can be moved to the background items system?
    //TODO should audio be in its own block or part of items?
    const conditionPairs = [
        [isAudio(scene), playAudio(scene)],
        [isTween(scene), createTween(scene)],
    ];

    pages[scene.currentPage].forEach(fp.cond(conditionPairs));
};



export class Narrative extends Screen {
    create() {
        this.currentPage = 0;
        this.addBackgroundItems();
        this.setLayout(["continue", "skip", "pause"]);
        //const tweens = this.context.theme.background.tweens.map(addTargets(this));
        //
        //tweens.forEach(this.tweens.add, this.tweens);

        startPage(this);

        //go through pages. If pages aren't present do what?
        //pages.forEach(names => {
        //
        //    //debugger
        //
        //    const x = this.cache
        //
        //    console.log(names)
        //
        //    //this.sound.play("narrative.dialogue1")
        //
        //    const conf = {
        //        mute: false,
        //        volume: 1,
        //        rate: 1,
        //        detune: 0,
        //        seek: 0,
        //        loop: false,
        //        delay: 0
        //    }
        //
        //
        //}, this)

        window.nrtv = this;

        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "continue",
            callback: nextPage(this),
        });
    }
}
