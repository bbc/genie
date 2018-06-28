import { assert } from "chai";
import * as sinon from "sinon";

import * as SettingsIcons from "../../src/core/layout/settings-icons";

describe("Settings Icons", () => {
  let sandbox;

  before(() => {
      sandbox = sinon.createSandbox();
  });

  afterEach(() => {
      sandbox.restore();
  });

  it("fires the correct callbacks when a signal on a channel is published", () => {
      const icons  = SettingsIcons.create("top-right", ["audioOff"]);
      console.log(icons);
      assert(icons);
  });
});
