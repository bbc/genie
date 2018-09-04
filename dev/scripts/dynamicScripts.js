"use strict";

function dynamicallyLoadScript(url) {
    var script = document.createElement("script");
    script.src = url;
    document.head.appendChild(script);
}

dynamicallyLoadScript("node_modules/phaser-ce/build/phaser.min.js");
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
            // console.log("Add script:", globals[global]);
            dynamicallyLoadScript(globals[global]);
        }
    }
};
request.send(null);
