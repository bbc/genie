const fse = require('fs-extra')

async function cleanupReports() {
  await fse.remove('mochawesome-report')
}

cleanupReports()