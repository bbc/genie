/**
 * Local rule sets for Genie.
 *
 * @example To override the disallow timers rule:
 *      // eslint-disable-next-line local-rules/disallow-timers
 *
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

const author = "@author BBC Children's D+E";
const license = "@license Apache-2.0";
const copyright = "@copyright BBC";

module.exports = {
	"disallow-timers": {
		meta: {
			docs: {
				description: "Disallow setTimeout",
				category: "Genie Restrictions",
				recommended: true,
			},
			schema: [],
		},
		create: context => ({
			CallExpression: node => {
				if (!["setTimeout", "setInterval"].includes(node.callee.name)) {
					return;
				}

				context.report({
					message: "To maintain pause functionality Phaser timers should be used over setTimeout/setInterval",
					node: node,
				});
			},
		}),
	},
	"require-bbc-header": {
		meta: {
			docs: {
				description: "Require an author, copyright and license tags in every file",
				category: "Genie Restrictions",
				recommended: true,
			},
			schema: [],
		},
		create: context => {
			return {
				Program() {
					const sourceCode = context.getSourceCode();
					const comments = sourceCode.getAllComments();
					const blockComments = comments.filter(comment => comment.type === "Block");

					[license, copyright, author].forEach(tag => {
						const tagPresent = blockComments.some(comment => comment.value.includes(tag));

						if (tagPresent) {
							return;
						}

						context.report({
							message: tag + " required in block comment (/**   */) at top of file",
							loc: { line: 1, column: 0 },
						});
					});
				},
			};
		},
	},
};
