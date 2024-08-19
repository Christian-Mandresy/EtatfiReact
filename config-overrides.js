const webpack = require('webpack');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'buffer': require.resolve('buffer/'),
    crypto: require.resolve("crypto-browserify"),
  };

  config.plugins.push(new NodePolyfillPlugin());

  return config;
};