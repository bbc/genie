/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

const awaitScript = url => {
    const script = document.createElement("script");
    script.src = url;
    script.async = false;
    document.head.appendChild(script);

    return new Promise(resolve => (script.onload = resolve));
};

const addMain = () => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = "src/main.js";
    document.head.appendChild(script);
};

const awaitGlobals = globals => globals.map(global => awaitScript(global.url));

fetch("globals.json")
    .then(response => response.json())
    .then(globals => {
        const awaitingScripts = [
            awaitScript("node_modules/phaser/dist/phaser.js"),
            awaitScript("node_modules/webfontloader/webfontloader.js"),
        ];

        return Promise.all(awaitingScripts.concat(awaitGlobals(globals)));
    })
    .then(addMain);
