import "phaser-ce";

import { AccessibleButton } from "../stubs/accessible-button";
import { DebugButton } from "./debug-button"

const BUTTON_PAD = 24;

class Group extends Phaser.Group {
    private vPos: string;
    private hPos: string;
    private buttons: DebugButton[] = [];
    private metrics: any;
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

        const testButton = {
        width: 200,
        height: 50,
        text: config.title,
        click: () => {
            console.log("test button");
        },
    };

        const newButton = new DebugButton(this.game, testButton)

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
                pos.y += child.height + BUTTON_PAD;
            } else {
                child.x = pos.x + child.width / 2;
                pos.x += child.width + BUTTON_PAD;
            }
        }, this);
    }

    private setGroupPosition() {
        const groupWidth = this.width;
        const horizontals = this.metrics[this.vPos === "middle" ? "safeHorizontals" : "horizontals"];

        switch (this.hPos) {
            case "left":
                this.x = horizontals[this.hPos] + this.metrics.pad;
                break;
            case "right":
                this.x = horizontals[this.hPos] - this.width - this.metrics.pad;
                break;
            case "center":
                this.x = horizontals[this.hPos] - groupWidth / 2 - BUTTON_PAD;
                break;
        }

        switch (this.vPos) {
            case "top":
                this.y = this.metrics.verticals[this.vPos] + this.metrics.pad;
                break;
            case "middle":
                this.y = this.metrics.verticals[this.vPos] - this.height / 2;
                break;
            case "bottom":
                this.y = this.metrics.verticals[this.vPos] - (this.height + this.metrics.pad);
                break;
        }
    }
}

export default Group;
