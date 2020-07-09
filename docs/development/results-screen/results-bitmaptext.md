# Results BitmapText

## Usage

Set the objects type to "bitmaptext" to create a results bitmaptext object.

| Name | Type | Default | Description |
|------|------|----------|-------------|
| content | string \| template | "" | The text to be displayed - can be a string template. |
| offsetX | integer | 0 | The x offset for this object. |
| offsetY | integer | 0 | The y offset for this object. |
| font | string | | The key of the font to use from the Bitmap Font cache. |
| size | integer | | The font size of this Bitmap Text. |

This object supports string [templates](https://lodash.com/docs/4.17.15#template).

## Example config

You may set data in your game component, that can be accessed on the results screen.  

For example:  
`this.transientData.results = { score: 20 };`

```json5
{
    type: "bitmaptext",
    content: "You scored: <%= score %>",
    offsetX: 0,
    offsetY: -18,
    font: "examples_titleFont",
    size: 50,
},
```