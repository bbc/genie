const { merge } = require("mochawesome-merge");
const generator = require('mochawesome-report-generator')

const mergeReport = async () => {
    const jsonReport = await merge();
    jsonReport;
    await generator.create(jsonReport);
}

mergeReport();
