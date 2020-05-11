# Accessibilify

## What is accessibilify?
Accessibilify is a utility function that is provided by Genie which can be used to make buttons accessible. This works by overlaying an invisible div element on the canvas that a player will then be able to tab to. 

Since Phaser 3 has no concept of buttons, buttons can be constructed by adding interactable images as shown in the example below.

## How do I use accessibilify?
First, you will need to import the `accessibilify` function from GENIE. 

Accessibilify config should have the following properties:
- `id`: The ID that will be assigned to the DOM element.
- `ariaLabel`: The ariaLabel that will be assigned to the DOM element.
- `tabbable`: Sets whether the DOM element can be tabbed to or not. True by default.

Set the config on your game object eg. `button.config`.  

The `accessibilify` function accepts your modified game object as an argument.

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
        button.config = {
            id: "next-page-button",
            ariaLabel: "Next Page",
        };
        accessibilify(button);
    }
}
```

## Config updates

If you change the config of the button, then call the update function on the buttons accessibleElement, the DOM element will be updated.

```javascript
button.config.tabbable = false;
button.accessibleElement.update();
```

## Cleanup

Genie will automatically clean up accessible elements as the player moves to a new screen so there is no manual tidy up required once you have made a button accessible.

