const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
        proxy: 'https://dev14.erpx.one',
    }
})
