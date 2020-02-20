# Results Audio

## Usage

Each row can play an audio file.

| Name | Type | Default | Description |
|------|------|----------|-------------|
| audio.key | string | optional | The asset key of the audio file to be played. |
| audio.delay | integer | optional | The delay before the audio file is played. |

## Example config

```json5
{
    rows: [
        {
            format: [],
            alpha: 0,
            audio: { key: 'results.boing', delay: 5000 },
        }
    ]
},
```