# Results Countup

## Usage

Set the objects type to "countup" to create a results countup object.

| Name | Type | Default | Description |
|------|------|----------|-------------|
| startCount | integer \| template | | The number to start counting from. |
| endCount | integer \| template | | The number to count to. |
| startDelay | integer | | The delay (in ms) before the counter starts. |
| countupDuration | integer | | The duration (in ms) of the countup. |
| audio.key | string | | The asset key of the audio file to play each count. |
| audio.singleTicksRange | integer | Infinity | Plays the audio each time the score increments by 1 - for all scores between startCount and `startCount + singleTicksRange`. |
| audio.ticksPerSecond | integer | 0 | Plays the audio this many times per second, for scores outside the singleTicksRange. |
| audio.startPlayRate | integer | | The initial playrate of the count audio - used for pitch shifting. |
| audio.endPlayRate | integer | | The final playrate of the count audio - used for pitch shifting. |
| offsetX | integer | 0 | The x offset for this object. |
| offsetY | integer | 0 | The y offset for this object. |
| textStyle | [Phaser TextStyle](https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Text.html#.TextStyle) | optional | The text style config object. (if not using bitmap font/text) |
| bitmapFont | string | | The key of the font to use from the Bitmap Font cache. (if using bitmap font/text) |
| size | integer | | The font size of this Bitmap Text. (if using bitmap font/text) |

This object supports [templates](https://lodash.com/docs/4.17.15#template).

## Audio Example

If you were to set the config to the following:
```
{
    type: 'countup',
    startCount: 0,
    endCount: '<%= score %>',
    startDelay: 1000,
    countupDuration: 1000,
    audio: {
        key: 'results.coin-sfx',
        singleTicksRange: 10,
        ticksPerSecond: 6,
    },
},
```

For scores between 0 and 10, the audio would play each time the score incremented (when the countup text updates).  
For scores above 10, the audio would play 6 times per second over the duration of the countup.

If the startCount were to be 10, and singleTicksRange were to be 5,  scores between 10 and 15 would play audio each time the score incremented. Scores above 15 would play audio 6 times per second.

## Example config

You may set data in your game component, that can be accessed on the results screen.  

For example:  
`this.transientData.results = { score: 20 };`

```json5
{
    type: 'countup',
    startCount: 0,
    endCount: '<%= score %>',
    startDelay: 1000,
    countupDuration: 1000,
    audio: {
        key: 'results.coin-sfx',
        singleTicksRange: 10,
        ticksPerSecond: 6,
        startPlayRate: 0.8,
        endPlayRate: 1.2,
    },
    offsetX: 15,
    offsetY: -20,
    textStyle: {
        fontFamily: 'ReithSans',
        fontSize: '24px',
        color: '#FFFF00',
        align: 'center',
    },
},
```