'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
console.log('运行环境', process.env.NODE_ENV)
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/admin/" : "./",
  outputDir: 'admin',
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    open: true,
    host: 'localhost',
    port: 8100,
    https: false,
    hotOnly: false,
    proxy: {
      '/apis': {
        target: 'https://xzsadmin.mrhuxt.cn',
        // target: "http://127.0.0.1:3456",
        pathRewrite: {
          // "^/api": "", // 重写接口
        },
        changeOrigin: true
      },
      '/api': {
        target: 'https://xzsadmin.mrhuxt.cn',
        // target: "http://localhost:8000",
        pathRewrite: {
          // "^/api": "", // 重写接口
        },
        changeOrigin: true
      }
    }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },

  chainWebpack (config) {
    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  }
}
