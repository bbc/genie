import * as signal from "../signal-bus.js";

export const gotoScreenWithData = (name, transientData, gameState, layoutFactory, context, navigation) => {
    signal.bus.removeChannel("gel-buttons");
    layoutFactory.removeAll();
    gameState.start(name, true, false, transientData, layoutFactory, context, navigation);
};
