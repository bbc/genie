# Scaling in Genie

Scaling has been setup in genie so that:
- The gameplay safe area is visible at all resolutions - this is the central 4:3 area (800x600).
- The full stage area is 1400x600.

The scaling engine is already set up to adapt the game to all ratios and screen sizes used by our target devices. The game will automatically scale up and down without any additional input from you. Our coordinate system is set up with the origin point at the centre, so `(0,0)` refers to the centre of the screen.

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