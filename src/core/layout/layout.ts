import * as _ from "lodash";

import { calculateMetrics } from "./calculate-metrics";
import gel from "./gel-defaults";
import Group from "./group";
import { groupLayouts } from "./group-layouts";

export class Layout {
    public buttons: { [s: string]: Phaser.Button };
    public root: Phaser.Group;
    private groups: { [s: string]: Group };
    private metrics: ViewportMetrics;

    /**
     * Creates a new layout. Called by engine.create for each screen component
     *
     * @param game - Phaser Game Instance
     * @param {Scaler} scaler
     * @param keyLookup
     * @param buttons
     */
    constructor(
        game: Phaser.Game,
        scaler: Scaler,
        buttons: any,
    ) {
        this.root = new Phaser.Group(game, game.world, undefined);

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
                        !!layout.arrangeV,
                    ),
            ),
        );
        this.buttons = _.zipObject(
            buttons,
            buttons.map((name: string) => this.groups[gel[name].group].addButton(gel[name])),
        );

        scaler.onScaleChange.add(this.resize, this);
    }

    /**
     * Attach a callback to the onInputUp event of a given Gel button
     *
     * @param button- gel button identifier
     * @param callback - callback function to attach
     */
    public setAction = (button: string, callback: () => any) => this.buttons[button].onInputUp.add(callback, this);

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
