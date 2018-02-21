// @ts-ignore
import * as fp from "lodash/fp";
import { DebugButton } from "./debug-button";

const horizontal: HorizontalPositions<(pos: number, width: number, pad: number) => number> = {
    left: (pos: number, width: number, pad: number) => pos + pad,
    right: (pos: number, width: number, pad: number) => pos - width - pad,
    center: (pos: number, width: number, pad: number) => pos - width / 2,
};

const vertical: VerticalPositions = {
    top: (pos: number, height: number, pad: number) => pos + pad,
    middle: (pos: number, height: number, pad: number) => pos - height / 2,
    bottom: (pos: number, height: number, pad: number) => pos - (height + pad),
};

const getGroupPosition = (sizes: GroupSizes) => ({
    x: getGroupX(sizes),
    y: getGroupY(sizes),
});

const getGroupX = (sizes: GroupSizes) => {
    const horizontals: HorizontalPositions<number> = sizes.metrics[
        sizes.pos.v === "middle" ? "safeHorizontals" : "horizontals"
    ] as HorizontalPositions<number>;
    return horizontal[sizes.pos.h](
        horizontals[sizes.pos.h] as number,
        sizes.width,
        sizes.metrics.borderPad * sizes.scale,
    );
};

const getGroupY = (sizes: GroupSizes) =>
    vertical[sizes.pos.v](
        sizes.metrics.verticals[sizes.pos.v] as number,
        sizes.height,
        sizes.metrics.borderPad * sizes.scale,
    );

class Group extends Phaser.Group {
    private buttons: DebugButton[] = [];
    private setGroupPosition: () => void;
    constructor(
        game: Phaser.Game,
        parent: Phaser.Group,
        private vPos: string,
        private hPos: string,
        private metrics: ViewportMetrics,
        private isVertical: boolean,
    ) {
        super(game, parent, fp.camelCase([vPos, hPos, isVertical ? "v" : ""].join(" ")));
        this.setGroupPosition = fp.flow(this.getSizes, getGroupPosition, this.setPos);
        this.setGroupPosition();
    }

    /**
     * TODO add interface for config
     */
    public addButton(config: any, keyLookup: any, position?: number) {
        if (position === undefined) {
            position = this.buttons.length;
        }

        const testButton: GelSpec = {
            width: 200,
            height: this.metrics.buttonMin,
            text: config.title,
            click: () => {
                console.log("test button");
            },
        };

        const newButton = new DebugButton(this.game, testButton);

        this.addAt(newButton, position);
        this.buttons.push(newButton);

        this.alignChildren();
        this.setGroupPosition();

        return newButton;
    }

    public addToGroup(item: any, position = 0) {
        item.anchor.setTo(0.5, 0.5);
        this.addAt(item, position);
        this.alignChildren();
        this.setGroupPosition();
    }

    public reset(metrics: ViewportMetrics) {
        this.metrics = metrics;
        const invScale = 1 / metrics.scale;
        this.scale.setTo(invScale, invScale);
        this.setGroupPosition();
    }

    private alignChildren = () => {
        const pos = { x: 0, y: 0 };

        const groupWidth = this.width; //Save here as size changes when you move children below
        this.children.forEach((childDisplayObject: PIXI.DisplayObject) => {
            const child = childDisplayObject as PIXI.DisplayObjectContainer;
            child.y = pos.y + child.height / 2;

            if (this.isVertical) {
                child.x = groupWidth / 2;
                pos.y += child.height + this.metrics.buttonPad;
            } else {
                child.x = pos.x + child.width / 2;
                pos.x += child.width + this.metrics.buttonPad;
            }
        }, this);
    };

    private getSizes: () => GroupSizes = () => ({
        metrics: this.metrics,
        pos: { h: this.hPos, v: this.vPos },
        width: this.width,
        height: this.height,
        scale: this.scale.x,
    });

    private setPos = (coords: { x: number; y: number }) => {
        this.x = coords.x;
        this.y = coords.y;
    };
}

export default Group;

interface GroupSizes {
    metrics: ViewportMetrics;
    pos: { h: string; v: string };
    width: number;
    height: number;
    scale: number;
}

interface HorizontalPositions<T> {
    left: T;
    right: T;
    center: T;
    [key: string]: T;
}

interface VerticalPositions {
    top: (pos: number, width: number, pad: number) => number;
    middle: (pos: number, width: number, pad: number) => number;
    bottom: (pos: number, width: number, pad: number) => number;
    [key: string]: (pos: number, width: number, pad: number) => number;
}
