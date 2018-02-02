export const GEL_MIN_RATIO_LHS = 4;
export const GEL_MIN_RATIO_RHS = 3;
export const GEL_MIN_RATIO = GEL_MIN_RATIO_LHS / GEL_MIN_RATIO_RHS;

export interface Scaler {
    onScaleChange: Phaser.Signal;
    getSize: Function;
}

/**
 * Create a new Scaler.
 * Called in the Genie startup function but will be called by the layout manager when it is ready.
 *
 * @example
 * const scaler = Scaler.create(600, game);
 * 
 * @param stageHeightPx - The authored height of the game in pixels
 * @param game - The phaser game to scale
 */

export function create(stageHeightPx: number, game: Phaser.Game): Scaler {
    game.scale.setGameSize(1, 1);
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.onSizeChange.add(onSizeChange);

    const onScaleChange = new Phaser.Signal();

    return {
        onScaleChange,
        getSize,
    };

    function onSizeChange() {
        const { width, height } = game.scale.getParentBounds();
        game.scale.setGameSize(width, height);
        const scale = calculateScale(width, height);
        onScaleChange.dispatch(width, height, scale, stageHeightPx);
    }

    function getSize() {
        const { width, height } = game.scale.getParentBounds();
        const scale = calculateScale(width, height);
        return {width, height, scale, stageHeightPx };
    }

    function calculateScale(w: number, h: number) {
        if (w / h >= GEL_MIN_RATIO) {
            // always fills container height
            return h / stageHeightPx;
        } else {
            //  always fills container width
            return w / stageHeightPx / GEL_MIN_RATIO;
        }
    }
}
