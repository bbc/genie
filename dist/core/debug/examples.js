/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Select } from "../../components/select/select-screen.js";
import { Results } from "../../components/results/results-screen.js";
import { Home } from "../../components/home.js";
export var examples = {
  "select-1": {
    scene: Select,
    title: "Select 1 item",
    routes: {
      next: "debug",
      home: "debug"
    }
  },
  "select-grid": {
    scene: Select,
    title: "Select Grid",
    routes: {
      next: "debug",
      home: "debug"
    }
  },
  "results-1-sec": {
    scene: Results,
    title: "Results: 1s countup",
    transientData: {
      stars: 5,
      gems: 50,
      keys: 1000000
    },
    routes: {
      continue: "debug",
      restart: "debug",
      home: "debug"
    }
  },
  "results-10-sec": {
    scene: Results,
    title: "Results: 10s countup",
    transientData: {
      stars: 5,
      gems: 50,
      keys: 1000000
    },
    routes: {
      continue: "debug",
      restart: "debug",
      home: "debug"
    }
  },
  "results-spine": {
    scene: Results,
    title: "Results:\nSpine animations",
    transientData: {
      powerups: 10,
      gems: 50,
      keys: 5
    },
    routes: {
      continue: "debug",
      restart: "debug",
      home: "debug"
    }
  },
  "results-row-particles": {
    scene: Results,
    title: "Results:\nRow Particles",
    transientData: {
      stars: 16,
      gems: 50,
      keys: 122
    },
    routes: {
      continue: "debug",
      restart: "debug",
      home: "debug"
    }
  },
  "background-animations": {
    scene: Home,
    title: "Background Animations",
    routes: {
      debug: "debug",
      next: "debug"
    }
  },
  "background-particles": {
    scene: Home,
    title: "Background Particles",
    routes: {
      debug: "debug",
      next: "debug"
    }
  }
};