const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    alias: {
      'process/browser': require.resolve('process/browser')
    },
    configure: {
      resolve: {
        fallback: {
          "crypto": require.resolve("crypto-browserify"),
          "buffer": require.resolve("buffer/"),
          "stream": require.resolve("stream-browserify"),
          "util": require.resolve("util/"),
          "vm": false,
          "process": require.resolve("process/browser")
        }
      }
    },
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser'
        })
      ]
    }
  }
}; 