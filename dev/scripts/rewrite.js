/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
module.exports = function(req, res, next) {
    if (req.method !== "GET" && req.method !== "HEAD") next();
    var match = req.url.match(/^\/node_modules\/genie(\/.*)/);
    if (match) {
        req.url = match[1];
        res.statusCode = 302;
        res.setHeader("Location", req.url);
        res.end();
    } else next();
};
