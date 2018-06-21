'use strict'
// 配置项
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: { // 开发环境

    // 静态文件夹路径
    assetsSubDirectory: 'static',
    // 编译后资源访问的路径
    assetsPublicPath: '/',
    // 代理
    proxyTable: {
        /*
            param:
            *:   表示挂代理时,识别的请求前缀
            url: 表示代理的地址
            例如
            '/api': {
                target: 'http://www.baidu.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                } //=> localhost:8000/api => http://www.baidu.com/api
            }

            代理的proxy格式可以参照以下github
            https://github.com/chimurai/http-proxy-middleware
        */
    },

    // Various Dev Server settings
    // 解决了原本仅为localhost 不能使用ip地址开发的问题
    host: '0.0.0.0',
    // 端口
    port: 8080,
    // 是否自动打开浏览器标识
    autoOpenBrowser: false,
    // webpack-dev-server中 是否全屏弹窗的形式显示编译过程中的错误标识
    errorOverlay: true,
    // 配合 friendly-errors-webpack-plugin
    notifyOnErrors: true,
    // dev-server 与监视文件相关的控制选项标识
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    
     /*
        这里是关于代码的 sourcemap 模式的选择
        可参考以下各种类型 https://segmentfault.com/a/1190000008315937
        几个类型的关键字
        cheap
        eval
        module
    */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    // 指的是缓存破坏,but找不到api
    cacheBusting: false,
    /*
        是否开启 CSS 的 source maps,
        开启的话将在head头部的style中加入 source map的相关信息
    */
    cssSourceMap: false
  },

  build: { //生产环境
    // index模板文件
    index: path.resolve(__dirname, '../dist/index.html'),

    // 路径
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    // 资源引用的路径(需要注意)
    assetsPublicPath: '../',

    /**
     * Source Maps
     */

    // 是否开启source map的标识
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    // devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    // gzip压缩
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
