import { Launcher } from "./examples/launcher.js";
import { Select } from "../../components/select/select-screen.js";

export const getDebugScreens = isDebug => {
    return isDebug
        ? {
              debug: {
                  scene: Launcher,
                  routes: {
                      home: "home",
                      select1: "select-1",
                      selectGrid: "select-grid",
                  },
              },
              "select-1": {
                  scene: Select,
                  routes: {
                      next: "debug",
                      home: "home",
                  },
              },
              "select-grid": {
                  scene: Select,
                  routes: {
                      next: "debug",
                      home: "home",
                  },
              },
          }
        : {};
};
