const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const webpack = require('webpack');

module.exports = {
    webpack: {
        resolve: {
            fallback: {
                "child_process": false, 
                "process":  false, 
                "fs": false, 
                "util": false, 
                "http": false,
                "https": false,
                "tls": false,
                "net": false,
                "crypto": false, 
                "path": false,
                "os": false, 
                "stream": false,
                "zlib": false
            },
            "crypto": require.resolve("crypto-browserify")
        },
        plugins: [
            new NodePolyfillPlugin({
                excludeAliases: ['console'],
            }),
            new webpack.ProvidePlugin({
                process: "process/browser.js",
            }),
        ]
    },
  };