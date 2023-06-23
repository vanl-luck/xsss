"use strict";
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath: "./",
  outputDir: "student",
  assetsDir: "static",
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    open: true,
    host: "localhost",
    port: 8001,
    https: false,
    hotOnly: false,
    proxy: {
      "/apis": {
        target: "http://soft.mrhuxt.cn:3456",
        // target: "http://127.0.0.1:3456",
        pathRewrite: {
          // "^/api": "", // 重写接口
        },
        changeOrigin: true,
      },
      "/api": {
        target: "http://xzsadmin.mrhuxt.cn:8100",
        pathRewrite: {
          // "^/api": "", // 重写接口
        },
        changeOrigin: true,
      },
    },
  },
  pages: {
    index: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
    },
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
};
