# Results Transitions

## Usage

Each row is a [Phaser.Container](https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html) and this tween will apply to all game objects in it.

See the [Phaser TweenDataConfig](https://photonstorm.github.io/phaser3-docs/Phaser.Types.Tweens.html#.TweenDataConfig) documentation to see how to configure the transition object.

The `target` of the tween is already set to the row container.

Be aware that when motion effects are disabled, the transition duration will be set to 0.

## Example config

```json5
{
    rows: [
        {
            format: [],
            alpha: 0,
            transition: { // the Phaser TweenDataConfig object
                scale: { from: 0, to: 1 },
                alpha: 1,
                duration: 2000,
                ease: 'Elastic.Out',
                delay: 5000,
            },
        }
    ]
},
```