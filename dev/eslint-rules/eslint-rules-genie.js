/**
 * Local rule sets for Genie.
 *
 * @example To override the disallow timers rule:
 *      // eslint-disable-next-line local-rules/disallow-timers
 */
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
};
