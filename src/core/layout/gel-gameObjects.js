import { GelButton } from "./gel-button.js";

export function addGelButton(x, y, metrics, config) {
    const gelButton = new GelButton(this.scene, x, y, metrics, config);
    this.displayList.add(gelButton);
    this.updateList.add(gelButton);
    return gelButton;
}
