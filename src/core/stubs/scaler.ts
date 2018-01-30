import "phaser-ce";
// @ts-ignore
import * as fp from "lodash/fp";

const GEL_SAFE_FRAME_RATIO = 4 / 3;

export function create(stageHeightPx: number, game: Phaser.Game): Scaler {
    // Will be immediately resized:
    game.scale.setGameSize(2, 2);
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;

    const onScaleChange = new Phaser.Signal();

    const scaleMethods = {
        wide: (width: number, height: number) => height / stageHeightPx,
        narrow: (width: number, height: number) => width / stageHeightPx / GEL_SAFE_FRAME_RATIO,
    };

    const getBounds = () => game.scale.getParentBounds();

    const getScale = ({ width, height }: {[s: string]: number;}) => {
        const scale = scaleMethods[width / height >= GEL_SAFE_FRAME_RATIO ? "wide" : "narrow"](width, height);
        return { width, height, scale, stageHeightPx };
    };

    const getSize = fp.flow(getBounds, fp.pick(["width", "height"]), getScale);

    const setSize = ({ width, height, scale, stageHeightPx }: {[s: string]: number;}) => {
        game.scale.setGameSize(width, height);
        onScaleChange.dispatch(width, height, scale, stageHeightPx);
    };

    const onSizeChange = fp.flow(getSize, setSize);

    game.scale.onSizeChange.add(onSizeChange);

    return {
        onScaleChange,
        getSize,
    };
}
