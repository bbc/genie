# DOM Text

DOM Text provides a way to add CSS styled DOM text to a scene which is independent of the canvas resolution. DOM text is automatically scaled with the scene and cleared on scene change. In addition DOM text provides some help for justifying blocks of text and centering them in the scene.

You can get started by calling `this.add.domText` from within a scene _(e.g: within Phaser's `create` method)_

`add.domText` accepts two parameters. The text you would like to display, and a config object.

Line breaks are automatically added on new lines (`"\n"`)

The config object can have any of the following properties:

```javascript
{
    style: {},              //any CSS styles you would like to apply.
    position: {x:0, y:0},   //Position values set from the center of the screen 
    align: "center",        //Justifies the entire block of text left|right|center
}
```


_Example:_
```javascript
const style = {
    "background-color": "white",
    font: "32px Arial",
    color: "red",
    "font-weight": "bold",
};

const domText = this.add.domText("some text\nmore text...", { style, position: { x: 0, y: -200 }, align: "center" });
```

## Helper Methods

### setText
Updates the text used e.g:
```Javascript
const domText = this.add.domText("some\n text...");
getText.setText("Some\nNew\nText");
```

### setPosition
Updates the text position based as pixel offsets from center fo the screen
```Javascript
const domText = this.add.domText("some\n text...");
getText.setPosition(100, 200);
```

### setAlignment
Set the text alignment to either "left", "right" or "center"
```Javascript
const domText = this.add.domText("some\n text...");
getText.setAlignment("center");
```

### setStyle
Set the CSS style of the text block. Any styles supplied are merged over the existing styles.

```Javascript
const domText = this.add.domText("some\n text...");
getText.setAlignment("center");

const newStyle = {
            "background-color": "white",
            font: "32px Arial",
            color: "red",
            "font-weight": "bold",
            padding: "5px 10px",
        };

domText.setStyle(newStyle)
```

### destroy
Removes the text from DOM
```Javascript
const domText = this.add.domText("some\n text...");
getText.destroy();
```


## Limitations
As Gel Text sits in its own `div` above the game canvas it always appears above all game elements.
