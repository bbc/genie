/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../core/screen.js";
import { accessibilify } from "../core/accessibility/accessibilify.js";
import { gmi } from "../core/gmi/gmi.js";
import { collections } from "../core/collections.js";
import { launchShopOverlay } from "../components/shop/shop.js";
import { eventBus } from "../core/event-bus.js";

export class Game extends Screen {
    itemUsed(data = { duration: 0 }) {
        console.log("Item used:", data);
        console.log("Item timer duration in seconds: ", data.duration);
        let time = data.duration * 1000;
        let timedEvent = this.time.delayedCall(time, this.onEvent, [], this);
    }

    onEvent() {
        console.log("Used item duration passed!");
    }

    calculateAchievements(item, amount, keys) {
        if (amount === 1) {
            gmi.achievements.set({ key: keys[0] });
        }
        if (amount === 5) {
            gmi.achievements.set({ key: keys[1] });
        }
        if (amount === 10) {
            gmi.achievements.set({ key: keys[2] });
        }
        if (amount === 20 && item === "gem") {
            gmi.achievements.set({ key: keys[3] });
        }
    }

    getAchievements() {
        const achievements = this.cache.json.get("achievements-data").map(achievement => achievement.key);
        return { star: achievements.slice(0, 3), gem: achievements.slice(3, 7), key: achievements.slice(7, 10) };
    }

    create() {
        eventBus.subscribe({
            channel: "shop",
            name: "used",
            callback: data => {
                this.itemUsed(data);
            },
        });
        const achievementNames = this.getAchievements();

        let keys = 0;
        let gems = 0;
        let stars = 0;

        this.add.image(0, 0, "home.background");
        this.addBackgroundItems();
        this.add
            .text(0, -190, "Test Game: Collect Items", {
                font: "65px ReithSans",
                fill: "#f6931e",
                align: "center",
            })
            .setOrigin(0.5);
        this.setLayout(["pause"]);

        const buttonKey = `${this.assetPrefix}.basicButton`;
        const buttonTextStyle = {
            font: "35px ReithSans",
            fill: "#fff",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 223,
        };

        const buttonNames = ["Star", "Gem", "Key"];

        const starImage = this.add.image(0, -70, `${this.assetPrefix}.star`);
        const gemImage = this.add.image(0, 20, `${this.assetPrefix}.gem`);
        const keyImage = this.add.image(0, 110, `${this.assetPrefix}.key`);
        const starScore = this.add.text(-50, -70, "0", buttonTextStyle).setOrigin(0.5);
        const gemScore = this.add.text(-50, 20, "0", buttonTextStyle).setOrigin(0.5);
        const keyScore = this.add.text(-50, 110, "0", buttonTextStyle).setOrigin(0.5);

        [-70, 20, 110].forEach((buttonYPosition, index) => {
            const buttonNumber = index + 1;
            const buttonText = "Collect " + buttonNames[index];
            const button = this.add
                .image(-200, buttonYPosition, buttonKey)
                .setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on("pointerup", () => increaseScores(buttonNames[index].toLowerCase()));
            this.add.text(-200, buttonYPosition, buttonText, buttonTextStyle).setOrigin(0.5);
            button.config = { id: buttonNumber, ariaLabel: buttonText };
            accessibilify(button);
        }, this);

        const continueButton = this.add
            .image(300, 20, buttonKey)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerup", () => onLevelComplete());
        continueButton.config = { id: 4, ariaLabel: "Continue" };
        accessibilify(continueButton);
        this.add.text(300, 20, "Continue", buttonTextStyle).setOrigin(0.5);

        const shopButton = this.add
            .image(-200, 220, buttonKey)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on("pointerup", () => launchShopOverlay(this, "shop"));
        shopButton.config = { id: 5, ariaLabel: "Shop" };
        accessibilify(shopButton);
        this.add.text(-200, 220, "Shop", buttonTextStyle).setOrigin(0.5);

        const onLevelComplete = () => {
            const { id, title } = this.transientData["level-select"].choice;
            markLevelAsComplete(id);
            this.transientData.results = {
                keys,
                gems,
                stars,
                levelId: title, // levelId is included in Results screen score stat
            };
            this.navigation.next();
        };

        const markLevelAsComplete = id => {
            const collection = collections.get(this.config.collection);
            collection.set({ id, state: "completed" });
        };

        const tweenItem = target => {
            this.tweens.add({
                targets: target,
                scale: 1.1,
                delay: 0,
                duration: 50,
            });
            this.tweens.add({
                targets: target,
                scale: 1.0,
                delay: 50,
                duration: 50,
            });
        };

        const unlockShopItem = () => {
            const shopCollection = collections.get("shop-items");
            const shieldItem = shopCollection.get("shield");
            shopCollection.set({ ...shieldItem, state: "" });
        };

        const increaseScores = item => {
            if (item === "star") {
                stars++;
                starScore.text = stars;
                tweenItem(starImage);
                this.sound.play("results.coin-sfx");
                this.calculateAchievements(item, stars, achievementNames[item]);
            }
            if (item === "gem") {
                gems++;
                gemScore.text = gems;
                tweenItem(gemImage);
                this.sound.play("results.gem-sfx");
                this.calculateAchievements(item, gems, achievementNames[item]);
                gems === 5 && unlockShopItem();
            }
            if (item === "key") {
                keys++;
                keyScore.text = keys;
                tweenItem(keyImage);
                this.sound.play("results.key-sfx");
                this.calculateAchievements(item, keys, achievementNames[item]);
            }
        };

        this.add
            .text(150, 200, `Character Selected: ${this.transientData["character-select"].choice.title}`, {
                font: "32px ReithSans",
                fill: "#f6931e",
                align: "center",
            })
            .setOrigin(0.5);
        this.add
            .text(150, 250, `Level Selected: ${this.transientData["level-select"].choice.title}`, {
                font: "32px ReithSans",
                fill: "#f6931e",
                align: "center",
            })
            .setOrigin(0.5);
    }
}
