const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
      proxy: {
        '/JSPM': {
          target: 'ws://localhost:27443', // Replace with JSPrintManager WebSocket endpoint if needed
          ws: true,
          changeOrigin: true,
        },
      },
    }
})
