const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
  },
  configureWebpack: {
    resolve: {
      fallback: {
        fs: false, // Prevents Node.js-specific modules from causing issues
        path: false,
      },
    },
    ignoreWarnings: [
      {
        module: /jsprintmanager/,
        message: /Critical dependency/,
      },
    ],
  },
})
