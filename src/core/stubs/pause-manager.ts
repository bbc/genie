import * as _ from "lodash";

export interface PauseManager {
    update(gameMuted: boolean): void;
    getButtons(popupScreenContext?: string, name?: string): PauseifiedButton[];
    destroyButtons(popupScreenContext?: string, name?: string): void;
    setBackground(background: Phaser.Image): void;
    pauseifyButton(
        button: Phaser.Button,
        hoverAudioSprite: Phaser.AudioSprite,
        marker: string,
        popupScreenContext?: string,
    ): PauseifiedButton;
}

export interface PauseifiedButton {
    name: string;
    popupScreenContext?: string;
    buttonUpdate(gameMuted: boolean): void;
    destroy(): void;
}

export function create(game: Phaser.Game, context: Context): PauseManager {
    const PRIORITY_ID = 999;
    const buttons: PauseifiedButton[] = [];

    return {
        update,
        getButtons,
        destroyButtons,
        setBackground,
        pauseifyButton,
    };

    function update(gameMuted: boolean) {
        buttons.forEach((button: PauseifiedButton) => {
            button.buttonUpdate(context.gameMuted);
        });

        if (gameMuted) {
            game.sound.mute = true;
        } else {
            game.sound.mute = false;
        }
    }

    function getButtons(popupScreenContext?: string, name?: string): PauseifiedButton[] {
        const obj = { popupScreenContext, name };
        return _.filter(buttons, _.pickBy(obj));
    }

    function destroyButtons(popupScreenContext?: string, name?: string): void {
        getButtons(popupScreenContext, name).forEach(c => {
            c.destroy();
        });
    }

    function setBackground(background: Phaser.Image) {
        background.inputEnabled = true;
        background.input.priorityID = PRIORITY_ID + context.popupScreens.length;
        background.events.onInputOver.add(() => {
            game.canvas.style.cursor = "default";
        });
    }

    function pauseifyButton(
        button: Phaser.Button,
        hoverAudioSprite: Phaser.AudioSprite,
        marker: string,
        popupScreenContext?: string,
    ): PauseifiedButton {
        const self = { name: marker, popupScreenContext, buttonUpdate, destroy };

        let hoverState = false;
        button.input.priorityID = PRIORITY_ID + context.popupScreens.length;
        buttons.push(self);
        return self;

        function buttonUpdate(gameMuted: boolean) {
            const bounds = button.getBounds();
            const hovering = bounds.contains(game.input.activePointer.x, game.input.activePointer.y);
            const screenIsAboveAllOthers = _.last(context.popupScreens) === popupScreenContext;

            if (screenIsAboveAllOthers) {
                if (hovering && hoverState === false) {
                    hoverState = true;

                    if (!gameMuted && hoverAudioSprite && button.visible) {
                        hoverAudioSprite.play(marker);
                    }
                } else if (!hovering) {
                    hoverState = false;
                }
            }
        }

        function destroy() {
            _.remove(buttons, self);
            button.destroy();
        }
    }
}
