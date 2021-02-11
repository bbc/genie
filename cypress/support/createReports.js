/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const { merge } = require("mochawesome-merge");
const generator = require("mochawesome-report-generator");

const options = {
    files: ["./output/reports/*.json"],
    reportDir: "./output/reports",
    reportFilename: "index.html",
};

const mergeReport = async () => {
    const jsonReport = await merge(options);
    jsonReport;
    await generator.create(jsonReport, options);
};

mergeReport();
