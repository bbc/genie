# Accessibilify

## What is accessibilify?
Accessibilify is a utility function that is provided by Genie which can be used to make buttons accessible. This works by overlaying an invisible div element on the canvas that a player will then be able to tab to. 

Since Phaser 3 has no concept of buttons, buttons can be constructed by adding interactable images as shown in the example below.

## How do I use accessibilify?
First, you will need to import the `accessibilify` function from GENIE. The `accessibilify` function accepts two arguments:
- `button`: The button that will be made accessible.
- `config`: An object that contains the configuration that will be used to create an accessible div element for the button. The config should have the following properties:
    - `id`: The ID that will be assigned to the DOM element.
    - `ariaLabel`: The ariaLabel that will be assigned to the DOM element.

```javascript
import { accessibilify } from "../../node_modules/genie/src/core/accessibilify/accessibilify.js";

export class GameScreen extends Screen {
    constructor() {
        super();
    }

    create() {
        const button = this.add
            .image(0, 0, buttonKey)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerup", () => this.navigate.next());
        const config = {
            id: "next-page-button",
            ariaLabel: "Next Page",
        };
        accessibilify(button, config);
    }
}
```

Genie will automatically clean up accessible elements as the player moves to a new screen so there is no manual tidy up required once you have made a button accessible.

