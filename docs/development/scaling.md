# Scaling in Genie

Scaling has been setup in genie so that:
- The gameplay safe area is visible at all resolutions - this is the central 4:3 area (800x600).
- The full stage area is 1400x600.

## Phaser Bounds
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