import "phaser-ce";

const GEL_SAFE_FRAME_RATIO = 4 / 3;
const GEL_SAFE_FRAME_RATIO_WIDE = 7 / 3;
const GEL_SAFE_FRAME_MARGIN_FACTOR = 0.02; // 2% margin

export function create(stageHeightPx: number, game: Phaser.Game): Scaler {
    // Will be immediately resized:
    game.scale.setGameSize(2, 2);
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
        return { width, height, scale, stageHeightPx };
    }

    function calculateScale(w: number, h: number) {
        if (w / h >= GEL_SAFE_FRAME_RATIO) {
            // stageHeightPx always fills container height
            return h / stageHeightPx;
        } else {
            // stageHeightPx * GEL_SAFE_FRAME_RATIO always fills container width
            return w / stageHeightPx / GEL_SAFE_FRAME_RATIO;
        }
    }
}
