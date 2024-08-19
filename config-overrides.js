const webpack = require('webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const { override, addWebpackAlias } = require('customize-cra');
const path = require("path");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'buffer': require.resolve('buffer/'),
    crypto: require.resolve("crypto-browserify"),
  };

  addWebpackAlias({
    'console-browserify': path.resolve(__dirname, 'node_modules/console-browserify'),
  })

  // Ajout de NodePolyfillPlugin pour les polyfills des modules Node.js
  config.plugins.push(new NodePolyfillPlugin());

  return config;
};
