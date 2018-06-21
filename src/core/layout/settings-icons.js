import * as signalBus from "../signal-bus.js";
import { GelButton } from "./gel-button.js";

export function create(group, buttonIds) {
  //console.log(group);

  const fxButtonConfig = {
    title: "FX Off",
    key: "fx-off-icon",
    id: "fx-off"
  }

  const audioButtonConfig = {
      title: "Audio Off",
      key: "audio-off-icon",
      id: "audio-off"
  }

  const game = group.game;
  console.log(buttonIds);
  const fxOffButton = group.addButton(fxButtonConfig, 0);

  if (!buttonIds.includes("audioOff")){
    const AudioOffButton = group.addButton(audioButtonConfig, 0);
  }
}