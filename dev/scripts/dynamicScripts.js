/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
function dynamicallyLoadScript(url) {
    var script = document.createElement("script");
    script.src = url;

    document.head.appendChild(script);
}

dynamicallyLoadScript("node_modules/phaser-ce/build/phaser.min.js");
dynamicallyLoadScript("node_modules/webfontloader/webfontloader.js");

fetch("/globals.json").then(response => {
    if (response.status >= 400) return;
    response.json().then(globals => {
        for (var global in globals) {
            if (globals.hasOwnProperty(global)) {
                dynamicallyLoadScript(globals[global]);
            }
        }
    });
});
