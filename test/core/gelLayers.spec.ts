/// <reference path="../../src/lib/gmi.d.ts" />

import { expect } from "chai";
import * as sinon from "sinon";
import "src/lib/phaser";

describe("GelLayers", () => {

    let mockGame: any;

    beforeEach(() => {
        
        mockGame = {
          add: {group: sinon.spy(function(){return {addChild: sinon.spy()}; })},
          renderer: {resolution: 800},
        };

    });

    xit("Should add three gel layer groups to the phaser game", () => {
        sinon.assert.calledWith(mockGame.add.group, undefined, "gelGroup", true);
        sinon.assert.calledWith(mockGame.add.group, undefined, "gelBackground");
        sinon.assert.calledWith(mockGame.add.group, undefined, "gelForeground");
        expect(mockGame.add.group.callCount).to.eql(3);
    });
});
