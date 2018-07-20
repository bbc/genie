function dynamicallyLoadScript(url) {
    var script = document.createElement("script");
    script.src = url;

    document.head.appendChild(script);
}

dynamicallyLoadScript("node_modules/phaser-ce/build/phaser.min.js");
dynamicallyLoadScript("node_modules/webfontloader/webfontloader.js");

import("/globals.js")
    .then(globals => {
        var globalLibraries = globals.globalLibraries;
        for (var globalLibrary in globalLibraries) {
            if (globalLibraries.hasOwnProperty(globalLibrary)) {
                dynamicallyLoadScript(globalLibraries[globalLibrary]);
            }
        }
    })
    .catch(e => {
        if (e.message.indexOf("Failed to fetch dynamically imported module") === -1) {
            throw e;
        }
    });
