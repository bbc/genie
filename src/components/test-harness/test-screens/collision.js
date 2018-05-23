import { Screen } from "../../../core/screen.js";

let hasCollided = false;

export class CollisionTest extends Screen {
    constructor() {
        super();
    }

    preload() {
        this.keyLookup = this.scene.keyLookups["game"];
    }

    create() {
        this.scene.addLayout(["home", "pause", "audioOff", "settings"]);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.spriteOne = this.game.add.sprite(0, 0, this.keyLookup.basicSprite);
        this.scene.addToBackground(this.spriteOne);
        this.game.physics.arcade.enable(this.spriteOne);
        this.spriteOne.body.enable = true;
        this.spriteOne.x = -200;

        this.spriteTwo = this.game.add.sprite(0, 0, this.keyLookup.basicSprite);
        this.scene.addToBackground(this.spriteTwo);
        this.game.physics.arcade.enable(this.spriteTwo);
        this.spriteTwo.body.enable = true;
        this.spriteTwo.x = 200;
    }

    update() {
        if (!hasCollided) {
            this.spriteOne.x += 1;
            this.spriteTwo.x -= 1;
        } else {
            this.spriteOne.x -= 1;
            this.spriteTwo.x += 1;
        }

        this.game.physics.arcade.collide(this.spriteOne, this.spriteTwo, () => {
            console.log("Collision!");
            hasCollided = true;
        });
    }
}
