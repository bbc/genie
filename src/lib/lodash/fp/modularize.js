/**
 * Convert lodash fp to ES6 modules.
 */
const fs = require('fs')
const path = require('path')

const searches =
[
	/module\.exports = require\((.*?)'\);/,
	/var (.*) = require\((.*)'\),\n *func = convert\('(.*)', require\((.*?)'\)\);/m,
	/func\.placeholder = require\('\.\/placeholder'\);/,
	/^(.*)\), require\('\.\/_falseOptions\.js';\n(.*)\);/m,
	/module\.exports =/,
	/^exports\./mg,
	/var convert = require\('\.\/convert'\);/,
	/export default convert\(require\((.*)\)\);/,
	/var baseConvert = require\('\.\/_baseConvert'\)[;,]/,
	/var mapping = require\('\.\/_mapping'\),\n.*fallbackHolder = require\('\.\/placeholder'\);/m,
	/^.*util = require\('\.\/_util'\);/m,
	/object = exports\.aliasToReal,/,
]

const replacements =
[
	"import _f from $1.js'\nexport default _f",
	"import $1 from $2.js';\nimport $3 from $4.js';\nlet func = convert('$3', $3);",
	"import placeholder from './placeholder.js';\nfunc.placeholder = placeholder",
	"import _falseOptions from './_falseOptions.js';\n$1;\n$2, _falseOptions);",
	"export default",
	"export const ",
	"import convert from './convert';",
	"import _fn from $1;\nexport default convert(_fn);",
	"import baseConvert from './_baseConvert.js';",
	"import * as mapping from './_mapping.js';\nimport fallbackHolder from './placeholder.js';",
	"import util from './_util.js';",
	"object = aliasToReal,",
]

const parseFile = fileName =>
(
	new Promise
	(
		(resolve, reject) =>
			fs.readFile
			(
				path.join(__dirname, fileName),
				{encoding: 'utf-8'},
				(err, data) => err ? reject(err) : resolve(data)
			)
	)
		.then(parseFileContent(fileName))
)

let filesCount = 0
let touchedCount = 0

const parseFiles = (err, items) =>
{
	const awaitFilesRead = items.map(parseFile)

	Promise.all(awaitFilesRead)
		.then(() =>
		{
			console.log('touched ' + touchedCount + '/' + filesCount + ' files')
		})

}

fs.readdir(__dirname, parseFiles)

const parseFileContent = fileName => (data, err) => parseContent(fileName, data, err)


const parseContent = (fileName, data, err) =>
{
	if (!err && fileName !== 'modularize.js')
	{
		filesCount++

		let str

		if (fileName === '_util.js')
		{
			let imports = []

			const replaceLines = (all, $1, $2) =>
			{
				imports.push($1)
				return "import " + $1 + " from '" + $2 + ".js';"
			}

			str = data.replace(/  '(.*)': require\('(.*)'\),?/gm, replaceLines)
			str = str.replace(/^module\.exports = {\n([\s\S]*)\n};$/m, "$1\n\nexport default {" + imports.join(',') + "}")
		}
		else
		{
			 str = searches.reduce((acc, search, idx) => acc.replace(search, replacements[idx]), data)
		}

		if (str !== data)
		{
			fs.writeFile(fileName, str, 'utf8', writeComplete)

			console.log('---------------' + fileName + '---------------')
			console.log(str)

			touchedCount++
		}
	}

	if (err) {console.log(err)}
}

const writeComplete = err =>
{
	if (err) throw err
}


