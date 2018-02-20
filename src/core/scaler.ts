export const GEL_MIN_RATIO_WIDTH = 4;
export const GEL_MIN_RATIO_HEIGHT = 3;
export const GEL_SAFE_FRAME_RATIO = GEL_MIN_RATIO_WIDTH / GEL_MIN_RATIO_HEIGHT;

// @ts-ignore
import * as fp from "lodash/fp";

const getScale = fp.curry((scaleMethods: any, stageHeightPx: number, { width, height }: { [s: string]: number }) => {
    const scale = scaleMethods[width / height >= GEL_SAFE_FRAME_RATIO ? "wide" : "narrow"](width, height);
    return { width, height, scale, stageHeightPx };
});

const getBounds = (game: Phaser.Game) => () => game.scale.getParentBounds();

export function create(stageHeightPx: number, game: Phaser.Game): Scaler {
    // Will be immediately resized:
    game.scale.setGameSize(2, 2);
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

    const onScaleChange = new Phaser.Signal();

    const scaleMethods = {
        wide: (width: number, height: number) => height / stageHeightPx,
        narrow: (width: number, height: number) => width / stageHeightPx / GEL_SAFE_FRAME_RATIO,
    };

    const getSize = fp.flow(getBounds(game), fp.pick(["width", "height"]), getScale(scaleMethods, stageHeightPx));

    const setSize = ({ width, height, scale, stageHeightPx: stageHeight }: { [s: string]: number }) => {
        game.scale.setGameSize(width, height);
        onScaleChange.dispatch(width, height, scale, stageHeight);
    };

    const onSizeChange = fp.flow(getSize, setSize);

    game.scale.onSizeChange.add(onSizeChange);

    return {
        onScaleChange,
        getSize,
    };
}
