# Gel Text

Gel Text provides a way to add DOM text to a scene. Gel text is automatically scaled with the scene and cleared on scene change. In addition Gel text provides some help for justifying blocks of text and centering them in the scene.

You can get started by calling `this.add.gelText` from within a scene _(e.g: within Phaser's `create` method)_

`add.gelText` accepts two parameters. The text you would like to display, and a config object.

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

const gelText = this.add.gelText("some text\nmore text...", { style, position: { x: 0, y: -200 }, align: "center" });
```
