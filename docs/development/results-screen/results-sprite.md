# Results Sprite

## Usage

Set the objects type to "sprite" to create a results sprite object. These sprites can be static or animated.

| Name | Type | Default | Description |
|------|------|----------|-------------|
| key | string | "" | The asset key of the image file to be used. |
| frame | string \| integer | optional | The initial frame to show. |
| offsetX | integer | 0 | The x offset for this object. |
| offsetY | integer | 0 | The y offset for this object. |
| anim | [Phaser Animation](https://photonstorm.github.io/phaser3-docs/Phaser.Types.Animations.html#.Animation) | optional | The configuration for the animation. |

## Example config

```json5
{
    type: 'sprite',
    key: 'game.diamond',
    frame: 0,
    offsetX: 20,
    offsetY: -20,
    anim: {
        frames: {
            start: 0,
            end: 14,
        },
        frameRate: 7,
        repeat: -1,
    },
},
```