export function drawSomething(game: Phaser.Game, layout: any) {
    //TODO these are not loaded currently
    //const sfx = game.add.audioSprite();
    const sfx = false; //TODO remove

    const testButton = {
        width: 200,
        height: 50,
        text: "GEL GEL GEL",
        click: () => {
            console.log("test button");
        },
    };

    const tempLayout = layout.create({}, ["exit", "howToPlay", "play", "settings"], sfx, false);

    const style = { font: "65px Arial", fill: "#FFCC66", align: "center" };
    const text = game.add.text(800, 200, "- Phaser -\nloading in the GMI", style);
    text.anchor.set(0.5);
}
