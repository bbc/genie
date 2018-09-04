/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
var path = require("path");
var fs = require("fs");

function dynamicallyExposeScript(namespace, url) {
    return {
        entry: path.resolve(url),
        rules: {
            test: new RegExp(RegExp.escape(url.split("/").slice(-1)[0]) + "$"),
            use: ["expose-loader?" + namespace],
        },
    };
}

RegExp.escape = function(text) {
    if (!arguments.callee.sRE) {
        var specials = ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"];
        arguments.callee.sRE = new RegExp("(\\" + specials.join("|\\") + ")", "g");
    }
    return text.replace(arguments.callee.sRE, "\\$1");
};

module.exports = function dynamicallyExposeGlobals(path) {
    var entry = [];
    var rules = [];
    var globals = JSON.parse(fs.readFileSync(path));
    for (var global in globals) {
        if (globals.hasOwnProperty(global)) {
            var dynamicConfig = dynamicallyExposeScript(global, globals[global]);
            entry.push(dynamicConfig.entry);
            rules.push(dynamicConfig.rules);
        }
    }
    return { entry, rules };
};
