import "phaser-ce";

import { Layout } from "../layout/layout";
import * as PauseManager from "./pause-manager";
import * as Sequencer from "./sequencer";

export class Screen extends Phaser.State {
    public layout: Layout;
    public pauseManager: PauseManager.PauseManager | undefined;
    private _context: Context;

    get context(): Context {
        return this._context;
    }

    public init(context: Context) {
        this._context = context;
    }

    public update() {
        this.context.accessibilityManager.update();
    }

    public exit(changedState: GameStateUpdate) {
        this.context.sequencer.next(changedState);
    }

    public shutdown() {
        this.cleanUp();
    }

    public cleanUp() {
        //this.context.gel.removeAll();
        this.context.accessibilityManager.teardown();
        if (this.layout) {
            this.layout.destroy();
        }
    }

    public pauseUpdate() {
        if (this.pauseManager) {
            this.pauseManager.update(this.context.gameMuted);
        }
    }

    public setGlobalMusic(
        sound?: Phaser.Sound,
        marker?: string,
        position?: number,
        volume?: number,
        loop?: boolean,
        forceRestart?: boolean,
    ) {
        if (this.context.globalMusic) {
            if (sound && this.context.globalMusic.key !== sound.key) {
                this.context.globalMusic.destroy();
                this.context.globalMusic = sound.play(marker, position, volume, loop, forceRestart);
            } else if (!sound) {
                this.context.globalMusic.destroy();
                this.context.globalMusic = undefined;
            }
        } else if (sound) {
            this.context.globalMusic = sound.play(marker, position, volume, loop, forceRestart);
        }
    }
}
