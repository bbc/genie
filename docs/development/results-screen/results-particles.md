# Results Particles

## Usage

Each row can have numerous emitters attached to it.

| Name | Type | Default | Description |
|------|------|----------|-------------|
| assetKey | string | "" | The asset key of the particle image file. |
| emitterConfigKey | string | "" | The asset key of the emitter config file. |
| offsetX | integer | 0 | The x offset for this emitter. |
| offsetY | integer | 0 | The y offset for this emitter. |
| delay | integer | 0 | The delay before the particle emitter starts. |
| duration | integer | Infinity | The duration that the emitter should emit particles for. |
| onTop | boolean | false | By default places the emitter behind the row content (text, sprites, etc) and in front of the row backdrop. To place the emitter above everything, set this to true. |

## Example config

```json5
{
    rows: [
        {
            format: [],
            particles: [
                {
                    assetKey: 'results.yellow',
                    emitterConfigKey: 'results.row-emitter',
                    // Optional settings
                    offsetX: 96,
                    offsetY: -10,
                    delay: 1000,
                    duration: 1000,
                },
                {
                    assetKey: 'results.red',
                    emitterConfigKey: 'results.row-emitter',
                }
            ]
        }
    ]
},