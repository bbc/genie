module.exports = {
    compress: true,
    staticIndex: "dev/index.dev.html",
    mime: {
        "application/wasm": ["wasm"],
    },
    rewrite: [{ from: "/node_modules/genie/*", to: "/$1" }],
};
