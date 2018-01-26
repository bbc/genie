import * as _ from "lodash";
import "phaser-ce";

import { Screen } from "../stubs/screen";
import { AccessibleButton } from "../stubs/accessible-button";
import gel from "./gel-defaults";
import Group from "./group";

const BORDER_PAD = 0.02;
const SAFE_ASPECT_RATIO = 4 / 3;

interface GroupLayout {
    vPos: string;
    hPos: string;
    arrangeV?: boolean;
}

const groupLayouts: GroupLayout[] = [
    { vPos: "top", hPos: "left" },
    { vPos: "top", hPos: "right" },
    { vPos: "bottom", hPos: "left" },
    { vPos: "bottom", hPos: "right" },
    { vPos: "middle", hPos: "left" },
    { vPos: "middle", hPos: "right" },
    { vPos: "bottom", hPos: "center" },
    { vPos: "middle", hPos: "center" },
    { vPos: "middle", hPos: "center", arrangeV: true },
];

class Layout {
    public buttons: { [name: string]: AccessibleButton };
    private groups: { [name: string]: Group };
    private metrics: ViewportMetrics;
    private root: Phaser.Group;
    private accessibilityManager: AccessibilityManager;

    /**
     * Creates a new layout. Called by engine.create per screen component
     *
     * @param game - Phaser Game Instance
     * @param screen - The Genie screen state this instance layout manages
     * @param scaler
     * @param addToBackground -
     * @param accessibilityManager -
     * @param keyLookup -
     * @param buttons -
     * @param sfx -
     * @param soundButton -
     */
    constructor(
        game: Phaser.Game,
        screen: Screen,     //TODO This is only used by the sound button methods which may need refactoring out
        scaler: Scaler,
        addToBackground: Function,
        accessibilityManager: AccessibilityManager,
        keyLookup: { [s: string]: string },
        buttons: any,
        sfx: Phaser.AudioSprite,
        soundButton = false,
    ) {
        this.root = new Phaser.Group(game, game.world, undefined);
        this.accessibilityManager = accessibilityManager;

        const size = scaler.getSize();
        this.resize(size.width, size.height, size.scale, size.stageHeightPx);

        this.groups = _.zipObject(
            groupLayouts.map(layout => _.camelCase([layout.vPos, layout.hPos, layout.arrangeV ? "v" : ""].join(" "))),
            groupLayouts.map(
                layout =>
                    new Group(
                        game,
                        this.root,
                        layout.vPos,
                        layout.hPos,
                        this.metrics,
                        this.accessibilityManager,
                        layout.arrangeV,
                    ),
            ),
        );
        this.buttons = _.zipObject(
            buttons,
            buttons.map((name: string) => this.groups[gel[name].group].addButton(gel[name], keyLookup)),
        );

        addToBackground(this.root); //TODO possibly just return this and use above? :)
        scaler.onScaleChange.add(this.resize, this);

        if (soundButton) {
            this.configureSoundButtons();
        }

        // _.forOwn(this.buttons, (value: AccessibleButton, key: string) => {
        //     this.buttons[key].onInputOver.add(this.onButtonMouseover, this, undefined, key);
        // });
    }

    public setAction(button: string, callback: Function) {
        this.buttons[button].onInputUp.add(callback, this);
    }

    public addToGroup(groupName: string, item: any, position?: number) {
        this.groups[groupName].addToGroup(item, position);
    }

    //TODO destroy this object as well as group members.
    public destroy() {
        this.root.destroy();
    }

    public configureSoundButtons() {
        // if (!this.screen.context.gameMuted) {
        //     this.createSoundOnButton();
        // } else {
        //     this.createSoundOffButton();
        // }
    }

    private onButtonMouseover(button: Phaser.Button, pointer: Phaser.Pointer, marker: string) {
        // this.sfx.play(marker);
    }

    private toggleAudioOff() {
        // if (this.screen.pauseManager) {
        //     this.screen.pauseManager.destroyButtons(undefined, "soundOff");
        // }
        // this.buttons.soundOn.destroy();
        // delete this.buttons.soundOn;
        // this.game.sound.mute = true;
        // this.screen.context.gameMuted = true;
        //
        // this.createSoundOffButton();
    }

    private toggleAudioOn() {
        // if (this.screen.pauseManager) {
        //     this.screen.pauseManager.destroyButtons(undefined, "soundOn");
        //     this.screen.pauseManager.destroyButtons(undefined, "soundOff");
        // }
        // this.buttons.soundOff.destroy();
        // delete this.buttons.soundOff;
        // this.game.sound.mute = false;
        // this.screen.context.gameMuted = false;
        //
        // this.createSoundOnButton();
    }

    private createSoundOnButton() {
        // this.buttons.soundOn = this.groups[gel.soundOn.group].addButton(gel.soundOn, this.keyLookup, 0);
        // if (this.screen.pauseManager) {
        //     //const sfx: Phaser.AudioSprite = this.game.add.audioSprite(this.screen.context.gel.keyLookup.sfx); //TODO
        //     this.screen.pauseManager.pauseifyButton(
        //         this.buttons.soundOn,
        //         this.sfx,
        //         "soundOff",
        //         this.screen.context.popupScreens[this.screen.context.popupScreens.length],
        //     );
        // }
        // this.buttons.soundOn.onInputOver.add(this.onButtonMouseover, this, undefined, "soundOff");
        // this.setAction("soundOn", this.toggleAudioOff);
    }

    private createSoundOffButton() {
        // this.buttons.soundOff = this.groups[gel.soundOff.group].addButton(gel.soundOff, this.keyLookup, 0);
        // if (this.screen.pauseManager) {
        //     this.screen.pauseManager.pauseifyButton(
        //         this.buttons.soundOff,
        //         this.sfx,
        //         "soundOn",
        //         this.screen.context.popupScreens[this.screen.context.popupScreens.length],
        //     );
        // }
        // this.buttons.soundOff.onInputOver.add(this.onButtonMouseover, this, undefined, "soundOn");
        // this.setAction("soundOff", this.toggleAudioOn);
    }

    private resize(width: number, height: number, scale: number, stageHeight: number) {
        this.metrics = { width, height: stageHeight, scale };

        // Border is padded to 2% of longest edge.
        this.metrics.pad = Math.floor(Math.max(this.metrics.width, this.metrics.height) * BORDER_PAD);
        this.metrics.isMobile = this.metrics.width < 770;

        this.metrics.horizontals = {
            left: this.metrics.width / this.metrics.scale * -0.5,
            center: 0,
            right: this.metrics.width / this.metrics.scale * 0.5,
        };

        const safeWidth = this.metrics.height * SAFE_ASPECT_RATIO;

        this.metrics.safeHorizontals = {
            left: safeWidth * -0.5,
            center: 0,
            right: safeWidth * 0.5,
        };

        this.metrics.verticals = {
            top: this.metrics.height * -0.5,
            middle: 0,
            bottom: this.metrics.height * 0.5,
        };

        if (this.groups) {
            _.forOwn(this.groups, (group: Group) => {
                group.reset(this.metrics);
            });
        }
    }
}

export default Layout;
