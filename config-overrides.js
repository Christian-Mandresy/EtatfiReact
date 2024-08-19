const webpack = require('webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require("path");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'buffer': require.resolve('buffer/'),
    crypto: require.resolve("crypto-browserify"),
  };

  plugins: [
    new NodePolyfillPlugin({
      excludeAliases: ['console-browserify'] // Exclude console polyfill
    })
  ]

  config.plugins.push(new NodePolyfillPlugin());



  return config;
};
