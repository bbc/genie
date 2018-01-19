// // import "src/lib/phaser";
// // import { Startup } from "src/lib/examples/core-state";

// import { expect } from "chai";

// import { startup } from "src/core/startup";

// describe("Startup", () => {
//     beforeEach(() => {
//         document.body.appendChild(document.createElement("div")).id = "test-div";
//         (window as any).getGMI = () => {
//             return {
//                 gameContainerId: "test-div",
//             } as Gmi;
//         };
//     });

//     afterEach(() => {
//         document.body.removeChild(document.getElementById("test-div"));
//     });

//     it("should create a canvas element", () => {
//         startup();

//         expect(document.getElementById("test-div").children.length).to.equal(1);
//     });
// });
