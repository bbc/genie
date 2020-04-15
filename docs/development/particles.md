# Particles

## Particle Emitter Config

You can load the config for a particle emitter by adding a particle config file to an asset pack.

**Example:**

```json5
{
    "type": "particles",
    "key": "spray",
    "url": "examples/particles/spray.json"
}
```

This can then be fetched from the Phaser json cache to initialise an emitter.

## Emit zones and Death zones

Emit zones and Death zones can take a Phaser Geom object as a [EdgeZoneSource](https://photonstorm.github.io/phaser3-docs/Phaser.Types.GameObjects.Particles.html#.EdgeZoneSource).  
As there is no way to create a Phaser Geom object in JSON, you can include these by setting the type to one of the following:

-   [Phaser.Geom.Rectangle](https://photonstorm.github.io/phaser3-docs/Phaser.Geom.Rectangle.html)
    -   Type is "rectangle"
    -   Accepted parameters are x, y, width and height.

-   [Phaser.Geom.Circle](https://photonstorm.github.io/phaser3-docs/Phaser.Geom.Circle.html)
    -   Type is "circle"
    -   Accepted parameters are x, y and radius.

-   [Phaser.Geom.Ellipse](https://photonstorm.github.io/phaser3-docs/Phaser.Geom.Ellipse.html)
    -   Type is "ellipse"
    -   Accepted parameters are x, y, width and height.

-   [Phaser.Geom.Line](https://photonstorm.github.io/phaser3-docs/Phaser.Geom.Line.html)
    -   Type is "line"
    -   Accepted parameters are x1, y1, x2 and y2.

-   [Phaser.Geom.Point](https://photonstorm.github.io/phaser3-docs/Phaser.Geom.Point.html)
    -   Type is "point"
    -   Accepted parameters are x and y.

-   [Phaser.Geom.Polygon](https://photonstorm.github.io/phaser3-docs/Phaser.Geom.Polygon.html)
    -   Type is "polygon"
    -   Accepted parameter is 'points' (array).

-   [Phaser.Geom.Triangle](https://photonstorm.github.io/phaser3-docs/Phaser.Geom.Triangle.html)
    -   Type is "triangle"
    -   Accepted parameters are x1, y1, x2, y2, x3 and y3.


**Example:**

```json5
{
    "x": 0,
    "y": 0,
    "angle": { "min": 260, "max": 280 },
    "speed": 400,
    "gravityY": 350,
    "lifespan": 4000,
    "quantity": 1,
    "emitZone": {
        "type": "random",
        "source": {
            "type": "circle", // The geom type to set
            // The accepted parameters fill the rest of this object.
            "x": 0,
            "y": 0,
            "radius": 180
        }
    },
    "deathZone": {
        "type": "onEnter",
        "source": {
            "type": "circle",
            "x": 300,
            "y": 0,
            "radius": 50
        }
    },
    "scale": { "start": 0.05, "end": 0.5 },
    "blendMode": "ADD"
}

```