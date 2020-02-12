# Code restrictions

## Use Phaser timers
Phaser timers should be used instead of setTimeout / setInterval.
This is necessary for the pause screen to function correctly.

## Phaser Bounds limits
Phaser bounds should be kept within these areas:

### Full stage area
```
x: -700
y: -300
width: 1400
height: 600
```
i.e: `this.matter.world.setBounds(-700, -300, 1400, 600);`

### Gameplay safe area
```
x: -400
y: -300
width: 800
height: 600
```
i.e: `this.matter.world.setBounds(-400, -300, 800, 600);`

## Linting

Genie linting rules can be used to check your code using:

`npm run eslint`