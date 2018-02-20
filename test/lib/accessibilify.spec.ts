import { expect } from "chai";
import * as sinon from "sinon";
import { accessibilify } from "../../src/lib/accessibilify";

describe("#accessibilify", () => {
    let mockButton: any;
    let mockLayoutFactory: any;
    let buttonAction: any;
    let overlay: any;
    let accessibleElement: any;
    let gameWidth: number;
    let gameHeight: number;
    let gameScale: number;
    let sandbox: sinon.SinonSandbox;

    before(() => {
        sandbox = sinon.sandbox.create();
        gameWidth = 800;
        gameHeight = 600;
        gameScale = 1;
        mockLayoutFactory = {
            getSize: () => {
                return { width: gameWidth, height: gameHeight, scale: gameScale };
            },
        };
    });

    beforeEach(() => {
        accessibleElement = document.createElement("div");
        overlay = document.createElement("div");
        overlay.id = "local-game-holder";
        buttonAction = sandbox.spy();
        mockButton = {
            name: "play",
            x: 0,
            y: 0,
            width: 200,
            height: 100,
            events: {
                onInputUp: {
                    dispatch: buttonAction,
                },
            },
            game: {
                input: {
                    activePointer: {},
                },
            },
        };
        sandbox
            .stub(document, "getElementById")
            .withArgs("local-game-holder")
            .returns(overlay);
        sandbox.stub(overlay, "appendChild").returns(sandbox.spy());
        sandbox
            .stub(document, "createElement")
            .withArgs("div")
            .returns(accessibleElement);
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("appends new div to overlay", () => {
        accessibilify(mockButton, mockLayoutFactory);
        sinon.assert.calledOnce(overlay.appendChild.withArgs(accessibleElement));
    });

    it("sets id of accessibleElement to same as button name", () => {
        accessibilify(mockButton, mockLayoutFactory);
        expect(accessibleElement.id).to.equal("play");
    });

    it("sets a tabindex on new accessibleElement", () => {
        accessibilify(mockButton, mockLayoutFactory);
        expect(accessibleElement.getAttribute("tabindex")).to.equal("0");
    });

    it("sets position on accessibleElement to absolute", () => {
        accessibilify(mockButton, mockLayoutFactory);
        expect(accessibleElement.style.position).to.equal("absolute");
    });

    it("sets aria-label as the button name", () => {
        accessibilify(mockButton, mockLayoutFactory);
        expect(accessibleElement.getAttribute("aria-label")).to.equal(mockButton.name);
    });

    describe("with optional ariaLabel argument", () => {
        it("sets aria-label as the argument value", () => {
            accessibilify(mockButton, mockLayoutFactory, "Play Button");
            expect(accessibleElement.getAttribute("aria-label")).to.equal("Play Button");
        });
    });

    describe("css left property", () => {
        it("is correct when game scale is 1", () => {
            gameWidth = 800;
            gameHeight = 600;
            gameScale = 1;
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.left).to.equal("300px");
        });

        it("is correct when game scale is 1.5", () => {
            gameWidth = 1200;
            gameHeight = 900;
            gameScale = 1.5;
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.left).to.equal("450px");
        });

        it("is correct when game scale is 0.5", () => {
            gameWidth = 400;
            gameHeight = 300;
            gameScale = 0.5;
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.left).to.equal("150px");
        });
    });

    describe("css top property", () => {
        it("is correct when game scale is 1", () => {
            gameWidth = 800;
            gameHeight = 600;
            gameScale = 1;
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.top).to.equal("250px");
        });

        it("is correct when game scale is 1.5", () => {
            gameWidth = 1200;
            gameHeight = 900;
            gameScale = 1.5;
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.top).to.equal("375px");
        });

        it("is correct when game scale is 0.5", () => {
            gameWidth = 400;
            gameHeight = 300;
            gameScale = 0.5;
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.top).to.equal("125px");
        });
    });

    describe("css width property", () => {
        it("is correct when game scale is 1", () => {
            gameWidth = 800;
            gameHeight = 600;
            gameScale = 1;
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.width).to.equal("200px");
        });

        it("is correct when game scale is 1.5", () => {
            gameWidth = 1200;
            gameHeight = 900;
            gameScale = 1.5;
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.width).to.equal("300px");
        });

        it("is correct when game scale is 0.5", () => {
            gameWidth = 400;
            gameHeight = 300;
            gameScale = 0.5;
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.width).to.equal("100px");
        });
    });

    describe("css height property", () => {
        it("is correct when game scale is 1", () => {
            gameWidth = 800;
            gameHeight = 600;
            gameScale = 1;
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.height).to.equal("100px");
        });

        it("is correct when game scale is 1.5", () => {
            gameWidth = 1200;
            gameHeight = 900;
            gameScale = 1.5;
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.height).to.equal("150px");
        });

        it("is correct when game scale is 0.5", () => {
            gameWidth = 400;
            gameHeight = 300;
            gameScale = 0.5;
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.height).to.equal("50px");
        });
    });

    describe("clicking on element", () => {
        it("dispatches the signal for the button action", () => {
            accessibilify(mockButton, mockLayoutFactory);
            accessibleElement.click();
            sinon.assert.calledOnce(buttonAction);
        });
    });

    describe("pressing enter key on the element", () => {
        it("dispatches the signal for the button action", () => {
            accessibilify(mockButton, mockLayoutFactory);
            const event = new KeyboardEvent("keyup", { key: "Enter" });
            accessibleElement.dispatchEvent(event);
            sinon.assert.calledOnce(buttonAction);
        });
    });

    describe("pressing space key on the element", () => {
        it("dispatches the signal for the button action", () => {
            accessibilify(mockButton, mockLayoutFactory);
            const event = new KeyboardEvent("keyup", { key: " " });
            accessibleElement.dispatchEvent(event);
            sinon.assert.calledOnce(buttonAction);
        });
    });

    describe("pressing a key other than enter or space on the element", () => {
        it("does not dispatch the signal for the button action", () => {
            accessibilify(mockButton, mockLayoutFactory);
            const event = new KeyboardEvent("keyup", { key: "a" });
            accessibleElement.dispatchEvent(event);
            sinon.assert.notCalled(buttonAction);
        });
    });
});
