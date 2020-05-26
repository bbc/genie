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

/*

    audio conf

    const conf = {
        mute: false,
        volume: 1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: false,
        delay: 0
    }
 */

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
        * Is Continue ok where it is?
        * Is there always a continue button?
*/

const endAnims = pageItems => {
    pageItems.forEach(item => {
        item.stop(1)
        //if (item instanceof Phaser.Sound.WebAudioSound) {
        //    item.stop();
        //} else if (item instanceof Phaser.Tweens.Tween) {
        //    item.stop(1);
        //}
    });
};

const nextPage = scene => () => {
    endAnims(scene.pageItems);
    scene.currentPage++;
    const lastPage = scene.currentPage >= scene.context.theme.background.pages.length;
    lastPage ? scene.navigation.next() : (scene.pageItems = startPage(scene));
};

const isAudio = scene => name => Boolean(scene.context.theme.background.audio.find(a => a.name === name));
const createAudio = scene => name => {
    const config = scene.context.theme.background.audio.find(a => a.name === name);
    const sound = scene.sound.add(config.key, config);
    sound.play();

    return sound;
};

const isTween = scene => name => Boolean(scene.context.theme.background.tweens.find(a => a.name === name));


const createTween = scene => name => {
    const config = { ...scene.context.theme.background.tweens.find(a => a.name === name)};
    delete config.name; //if name is present tween will mangle it on the gameObject
    config.targets = config.targets.map(scene.children.getByName, scene.children);

    return scene.tweens.add(config);
};

const startPage = scene => {
    const pages = scene.context.theme.background.pages;

    //TODO maybe this can be moved to the background items system?
    //TODO should audio be in its own block or part of items?
    const conditionPairs = [
        [isAudio(scene), createAudio(scene)],
        [isTween(scene), createTween(scene)],
    ];

    return pages[scene.currentPage].map(fp.cond(conditionPairs));
};

export class Narrative extends Screen {
    create() {
        this.currentPage = 0;
        this.addBackgroundItems();
        this.setLayout(["continue", "skip", "pause"]);
        this.pageItems = startPage(this);

        window.nrtv = this;

        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "continue",
            callback: nextPage(this),
        });
    }
}
