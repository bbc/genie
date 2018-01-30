import * as _ from "lodash";
import "phaser-ce";

import { AccessibleButton } from "../stubs/accessible-button";
import gel from "./gel-defaults";
import { groupLayouts } from "./group-layouts";
import Group from "./group";
import { calculateMetrics } from "./calculate-metrics";

export class Layout {
    public buttons: { [s: string]: AccessibleButton };
    private groups: { [s: string]: Group };
    private metrics: ViewportMetrics;
    public root: Phaser.Group;
    private accessibilityManager: AccessibilityManager;

    /**
     * Creates a new layout. Called by engine.create for each screen component
     *
     * @param game - Phaser Game Instance
     * @param {Scaler} scaler
     * @param accessibilityManager
     * @param keyLookup
     * @param buttons
     */
    constructor(
        game: Phaser.Game,
        scaler: Scaler,
        accessibilityManager: AccessibilityManager,
        keyLookup: { [s: string]: string },
        buttons: any,
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

        scaler.onScaleChange.add(this.resize, this);
    }

    public setAction = (button: string, callback: Function) => this.buttons[button].onInputUp.add(callback, this);

    public addToGroup = (groupName: string, item: any, position?: number) =>
        this.groups[groupName].addToGroup(item, position);

    public destroy = () => this.root.destroy();

    private resize(width: number, height: number, scale: number, stageHeight: number) {
        this.metrics = calculateMetrics(width, height, scale, stageHeight);

        if (this.groups) {
            _.forOwn(this.groups, (group: Group) => group.reset(this.metrics));
        }
    }
}
