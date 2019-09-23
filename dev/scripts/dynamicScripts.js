/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

"use strict";

function dynamicallyLoadScript(url) {
    var script = document.createElement("script");
    script.src = url;
    script.async = false;
    document.head.appendChild(script);
}

dynamicallyLoadScript("node_modules/phaser/dist/phaser.js");
dynamicallyLoadScript("node_modules/webfontloader/webfontloader.js");

/* Cannot use fetch because of IE11 */
var request = new XMLHttpRequest();
request.open("GET", "/globals.json", true);
request.onload = function() {
    if (request.status >= 400) return;
    const globals = JSON.parse(request.responseText);
    let global;
    for (global in globals) {
        if (globals.hasOwnProperty(global)) {
            dynamicallyLoadScript(globals[global]);
        }
    }
};
request.send(null);
