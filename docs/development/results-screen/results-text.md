# Results Text

## Usage

Set the objects type to "text" to create a results text object.

| Name | Type | Default | Description |
|------|------|----------|-------------|
| content | string \| template | "" | The text to be displayed - can be a string template. |
| offsetX | integer | 0 | The x offset for this object. |
| offsetY | integer | 0 | The y offset for this object. |
| textStyle | [Phaser TextStyle](https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html#.TextStyle) | optional | The text style config object. |

This object supports string [templates](https://lodash.com/docs/4.17.15#template).

## Example config

You may set data in your game component, that can be accessed on the results screen.  

For example:  
`this.transientData.results = { score: 20 };`

```json5
{
    type: 'text',
    content: 'You scored: <%= score %>',
    offsetX: 0,
    offsetY: -20,
    textStyle: {
        fontFamily: 'ReithSans',
        fontSize: '24px',
        color: '#FFFFFF',
    },
},
```