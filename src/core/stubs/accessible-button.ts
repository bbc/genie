import * as _ from "lodash";

export class AccessibleButton extends Phaser.Button {
    public domElement: HTMLElement;

    private ariaLabel: string;
    private cullAccessible: boolean;
    private tabIndex: number;
    private title: string;

    constructor(
        game: Phaser.Game,
        title: string,
        ariaLabel: string,
        anchorPoints: AnchorPoints,
        tabIndex: number,
        cullAccessible: boolean,
        x: number,
        y: number,
        key: string,
        callback?: () => any,
        callbackContext?: Phaser.State,
    ) {
        super(game, x, y, key, callback, callbackContext, 2, 0, 1);

        this.title = title;
        this.ariaLabel = ariaLabel;
        this.tabIndex = tabIndex;
        this.cullAccessible = cullAccessible;

        this.anchor.setTo(anchorPoints.x, anchorPoints.y);

        this.createDomElement();
        game.add.existing(this);
    }

    public update() {
        if (this.visible) {
            if (this.cullAccessible && this.isOutsideScreen()) {
                this.removeDomElement();
                return;
            }
            if (!this.domElement) {
                this.createDomElement();
            }
            this.repositionDomElement();
        } else {
            this.removeDomElement();
        }
    }

    private createDomElement() {
        this.domElement = document.createElement("div");

        this.domElement.setAttribute("id", this.domId());
        this.domElement.setAttribute("role", "button");
        this.domElement.setAttribute("tabindex", this.tabIndex.toString());
        this.domElement.setAttribute("title", this.title);
        this.domElement.setAttribute("aria-label", this.ariaLabel);
        this.domElement.style.position = "absolute";

        this.domElement.addEventListener("keydown", this.handleKeyDown.bind(this));
    }

    private domId() {
        return _.kebabCase(this.title);
    }

    private removeDomElement() {
        this.domElement.remove();
    }

    private repositionDomElement() {
        const elementInfo = this.getElementInfo();

        this.domElement.style.left = elementInfo.x + "px";
        this.domElement.style.top = elementInfo.y + "px";
        this.domElement.style.width = elementInfo.width + "px";
        this.domElement.style.height = elementInfo.height + "px";
    }

    private isOutsideScreen() {
        const pixiBounds = this.getBounds();
        const bounds = new Phaser.Rectangle(pixiBounds.x, pixiBounds.y, pixiBounds.width, pixiBounds.height);

        return bounds.top > this.game.height || bounds.bottom < 0 || bounds.left > this.game.width || bounds.right < 0;
    }

    private getElementInfo() {
        const bounds = this.getBounds();
        const scaleFactor = this.game.scale.scaleFactorInversed;
        const width = bounds.width * scaleFactor.x;
        const height = bounds.height * scaleFactor.y;
        const x = bounds.x * scaleFactor.x;
        const y = bounds.y * scaleFactor.y;

        return {
            width: width.toString(),
            height: height.toString(),
            x: x.toString(),
            y: y.toString(),
        };
    }

    private handleKeyDown(event: KeyboardEvent) {
        if (event.code === "Enter" || event.code === "Space") {
            this.onInputUp.dispatch();
        }
    }
}
