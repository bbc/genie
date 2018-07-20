function dynamicallyLoadScript(url) {
    var script = document.createElement("script");
    script.src = url;

    document.head.appendChild(script);
}

dynamicallyLoadScript("node_modules/phaser-ce/build/phaser.min.js");
dynamicallyLoadScript("node_modules/webfontloader/webfontloader.js");
