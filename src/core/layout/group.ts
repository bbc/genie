import "phaser-ce";

//import { AccessibleButton } from "../stubs/accessible-button";
import { DebugButton } from "./debug-button";

const horizontal: any = {
    left: (pos: number, width: number, pad: number) => pos + pad,
    right: (pos: number, width: number, pad: number) => pos - width - pad,
    center: (pos: number, width: number, pad: number) => pos - width / 2,
};

const vertical: any = {
    top: (pos: number, height: number, pad: number) => pos + pad,
    middle: (pos: number, height: number, pad: number) => pos - height / 2,
    bottom: (pos: number, height: number, pad: number) => pos - (height + pad),
};

class Group extends Phaser.Group {
    private vPos: string;
    private hPos: string;
    private buttons: DebugButton[] = [];
    private metrics: ViewportMetrics;
    private vertical: boolean;
    private accessibilityManager: AccessibilityManager;

    constructor(
        game: Phaser.Game,
        parent: Phaser.Group,
        vPos: string,
        hPos: string,
        metrics: ViewportMetrics,
        accessibilityManager: AccessibilityManager,
        vertical?: boolean,
    ) {
        super(game, parent);

        this.game = game;

        this.accessibilityManager = accessibilityManager;

        this.vertical = !!vertical;

        this.vPos = vPos;
        this.hPos = hPos;
        this.metrics = metrics;
        this.setGroupPosition();
    }

    /**
     * TODO add interface for config
     */
    public addButton(config: any, keyLookup: any, position?: number) {
        if (position === undefined) {
            position = this.buttons.length;
        }

        // const newButton = this.accessibilityManager.createButton(
        //     config.title,
        //     config.ariaLabel,
        //     { x: 0.5, y: 0.5 },
        //     1,
        //     true,
        //     0,
        //     0,
        //     keyLookup[config.key],
        // );

        const testButton: GelSpec = {
            width: 200,
            height: this.metrics.buttonMin,
            text: config.title,
            click: () => {
                console.log("test button");
            },
        };

        const newButton = new DebugButton(this.game, testButton);

        this.addAt(newButton.sprite, position);
        this.buttons.push(newButton);

        //TODO below are failing when getting group width
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

    private alignChildren() {
        const pos = { x: 0, y: 0 };

        const groupWidth = this.width; //Save here as size changes when you move children below
        this.children.forEach((childDisplayObject: PIXI.DisplayObject) => {
            const child = childDisplayObject as PIXI.DisplayObjectContainer;
            child.y = pos.y + child.height / 2;

            if (this.vertical) {
                child.x = groupWidth / 2;
                pos.y += child.height + this.metrics.buttonPad;
            } else {
                child.x = pos.x + child.width / 2;
                pos.x += child.width + this.metrics.buttonPad;
            }
        }, this);
    }

    private setGroupPosition() {
        const horizontals: any = this.metrics[this.vPos === "middle" ? "safeHorizontals" : "horizontals"];
        this.x = horizontal[this.hPos](horizontals[this.hPos], this.width, this.metrics.borderPad * this.scale.x);
        this.y = vertical[this.vPos](
            (this.metrics.verticals as any)[this.vPos],
            this.height,
            this.metrics.borderPad * this.scale.y,
        );
    }
}

export default Group;
