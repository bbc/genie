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
    let screenResized: () => void;
    let buttonBoundsX: number;
    let buttonBoundsY: number;
    let buttonBoundsWidth: number;
    let buttonBoundsHeight: number;
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
        buttonBoundsX = 50;
        buttonBoundsY = 50;
        buttonBoundsWidth = 200;
        buttonBoundsHeight = 100;
        mockButton = {
            name: "play",
            events: {
                onInputUp: {
                    dispatch: buttonAction,
                },
            },
            game: {
                input: {
                    activePointer: {},
                },
                canvas: {
                    parentElement: overlay,
                },
                height: gameHeight,
                width: gameWidth,
                scale: {
                    onSizeChange: {
                        add: (debouncedCallback: () => void) => {
                            screenResized = debouncedCallback;
                        },
                    },
                },
            },
            getBounds: () => {
                return {
                    x: buttonBoundsX,
                    y: buttonBoundsY,
                    width: buttonBoundsWidth,
                    height: buttonBoundsHeight,
                };
            },
        };
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
        it("is the same as the button bounds x location", () => {
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.left).to.equal("50px");
        });

        describe("when position changes due to screen resize", () => {
            it("changes value accordingly", () => {
                const clock = sandbox.useFakeTimers();
                accessibilify(mockButton, mockLayoutFactory);
                buttonBoundsX = 100;
                screenResized();
                clock.tick(200);

                expect(accessibleElement.style.left).to.equal("100px");
            });
        });
    });

    describe("disabling buttons that go out of bounds", () => {
        it("sets the tab index to minus one when button moves out of bounds", () => {
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.getAttribute("tabindex")).to.equal("0");
            buttonBoundsX = 1000;
            mockButton.update();
            expect(accessibleElement.getAttribute("tabindex")).to.equal("-1");
        });

        it("sets the tab index to zero when button moves back into bounds", () => {
            accessibilify(mockButton, mockLayoutFactory);
            buttonBoundsX = 1000;
            mockButton.update();
            buttonBoundsX = 100;
            mockButton.update();
            expect(accessibleElement.getAttribute("tabindex")).to.equal("0");
        });

        it("sets the visibility to 'hidden' when button moves out of bounds", () => {
            accessibilify(mockButton, mockLayoutFactory);
            buttonBoundsX = 1000;
            mockButton.update();
            expect(accessibleElement.style.visibility).to.equal("hidden");
        });

        it("sets the visibility to 'visible' when button moves back into bounds", () => {
            accessibilify(mockButton, mockLayoutFactory);
            buttonBoundsX = 1000;
            mockButton.update();
            buttonBoundsX = 100;
            mockButton.update();
            expect(accessibleElement.style.visibility).to.equal("visible");
        });
    });

    describe("css top property", () => {
        it("is the same as the button bounds y location", () => {
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.top).to.equal("50px");
        });

        describe("when position changes due to screen resize", () => {
            it("changes value accordingly", () => {
                const clock = sandbox.useFakeTimers();
                accessibilify(mockButton, mockLayoutFactory);
                buttonBoundsY = 100;
                screenResized();
                clock.tick(200);

                expect(accessibleElement.style.top).to.equal("100px");
            });
        });
    });

    describe("css width property", () => {
        it("is the same as the button bounds width value", () => {
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.width).to.equal("200px");
        });

        describe("when position changes due to screen resize", () => {
            it("changes value accordingly", () => {
                const clock = sandbox.useFakeTimers();
                accessibilify(mockButton, mockLayoutFactory);
                buttonBoundsWidth = 500;
                screenResized();
                clock.tick(200);

                expect(accessibleElement.style.width).to.equal("500px");
            });
        });
    });

    describe("css height property", () => {
        it("is the same as the button bounds height value", () => {
            accessibilify(mockButton, mockLayoutFactory);
            expect(accessibleElement.style.height).to.equal("100px");
        });

        describe("when position changes due to screen resize", () => {
            it("changes value accordingly", () => {
                const clock = sandbox.useFakeTimers();
                accessibilify(mockButton, mockLayoutFactory);
                buttonBoundsHeight = 300;
                screenResized();
                clock.tick(200);

                expect(accessibleElement.style.height).to.equal("300px");
            });
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
