'use strict'
// 开发模式配置文件

// 引入工具集合的文件
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
// 合并插件类似object.assign合并公共部分
const merge = require('webpack-merge')
// node的path工具函数
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
// webpack 复制文件和文件夹的插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 自动生成 html 并且注入到 .html 文件中的插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 自动检索下一个可用端口
const portfinder = require('portfinder')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
/*
  http://nodejs.cn/api/process.html#process_process_env
  process.env 是在node环境中 返回一个包含用户环境信息的对象。

  ------
  这里的p.e属性是node环境原生的,与下面用webpack.d*去定义出来不同,
  要改变里面的值可参考 ./build.js
  直接
  process.env.NODE_ENV = 'production'
  ------

*/

// 获取在process.env 定义的host和port
const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

// 多页面html路径集合
const pages = utils.getEntry('./src/pages/*/*.html');

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    // css-loader的加工
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  
  // 检测开发环境下是否生成source map(并且生成的模式是怎么样)
  devtool: config.dev.devtool,

  /*
    https://doc.webpack-china.org/configuration/dev-server/#src/components/Sidebar/Sidebar.jsx
    webpack-dev-server 的配置

    package.json中
    "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js"
    --progess 将运行进度输出到控制台。即npm run dev 显示module 的loading
    --inline  应用程序启用内联模式(inline mode)。
              这意味着一段处理实时重载的脚本被插入到你的包(bundle)中，并且构建消息将会出现在浏览器控制台
    (--inline = false 关闭这种模式 那么将不会出现修改代码后实时刷新)
  */
  devServer: {
    // 开发过程中,可配置控制台显示的内容
    clientLogLevel: 'warning',
    // History API 当遇到 404 响应时会被替代为 index.html
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    /*
      启用 webpack 的模块热替换特性

      api提到,打开了这个选项 webpack会自动加载HMR的相关内容(HotModuleReplacement),所以不需要额外的配置.

      --------
      与旧版的vue-cli+webpack2.0的 dev-middleware结合hot-middleware 实现类似的功能
      如果你使用了 webpack-dev-middleware 而没有使用 webpack-dev-server，
      请使用 webpack-hot-middleware package 包，以在你的自定义服务或应用程序上启用 HMR。
      --------

    */
    hot: true,
    // 告诉服务器从哪里提供内容。
    contentBase: false, // since we use CopyWebpackPlugin.
    // 一切服务都启用gzip 压缩
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    // 是否自动打开浏览器
    open: config.dev.autoOpenBrowser,
    // openPage这个属性可以配置默认打开浏览器的页面
    // openPage: '/module/home.html',
    // 是否全屏弹窗的形式显示编译过程中的错误
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    // 指的是url的访问路径前缀
    publicPath: config.dev.assetsPublicPath,
    // 代理
    proxy: config.dev.proxyTable,
    // 除了初始启动信息之外的任何内容都不会被打印到控制台
    quiet: true, // necessary for FriendlyErrorsPlugin
    // 与监视文件相关的控制选项。
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    /*
      https://doc.webpack-china.org/plugins/define-plugin/
      允许在环境中产生一个全局变量, 例如下面'process.env', 就等于隔壁文件夹 dev.env.js export出来的内容
      具体的规则看上方api

      但是以下定义的变量在配置文件中去引用会报错,只允许在服务中编写的代码中使用
    */
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),

    /*
      模块热替换(Hot Module Replacement 或 HMR)

      当上面的 devServer中 hot:true时, 这个模块必须存在,不然webpack会报错.
      这个模块结合上面的hot是用于,
      检测到页面更新,在不刷新页面的情况下替换内容,
      如果hot: true与这个模块均不存在, 则跟旧版本的 dev-middleware/hot-*一样,修改即会刷新
    */
    new webpack.HotModuleReplacementPlugin(),

    // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.

    // 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。这样可以确保输出资源不会包含错误。
    new webpack.NoEmitOnErrorsPlugin(),
    
    /*
      https://doc.webpack-china.org/plugins/html-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
      该插件将为你生成一个HTML5文件

      配置项文档
      https://github.com/jantimon/html-webpack-plugin#configuration

      会结合base.conf.js设置中的 入口文件和输出文件,
      将内容根据输出filename.生成js文件 script到当前的html种
    */
    // new HtmlWebpackPlugin({
    //   // 生成html的名称
    //   filename: 'index.html',
    //   // 生成html所需的模板路径
    //   template: 'index.html',
      
    //     这个配置项指js文件插入的位置 

    //     选项: true body head false
    //     true和body相同,插入body最后
    //     head 插入head里面
      
    //   inject: true
    // }),

    /*
      https://doc.webpack-china.org/plugins/copy-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
      这个插件是用于复制文件和文件夹,在这里是将静态文件夹的内容拷贝一份在开发环境中

      new CopyWebpackPlugin([patterns], options)
      A pattern looks like: { from: 'source', to: 'dest' }
    */
    new CopyWebpackPlugin([
      {
        // 拷贝的路径
        from: path.resolve(__dirname, '../static'),
        // 访问的路径
        to: config.dev.assetsSubDirectory,
        // 忽略拷贝的内容(具体的文件名或模糊的路径)
        ignore: ['.*']
      }
    ])
  ]
})

for(let pathName in pages){
  /*
    https://doc.webpack-china.org/plugins/html-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
  */
  let options = {
    filename: `${pathName}.html`,
    template: pages[pathName],
    inject: true,
    // 指定当前的html插入的模块(如果不设定会将所有页面的js都插入, - -)
    chunks: [pathName]
  }
  console.log(options)

  devWebpackConfig.plugins.push(new HtmlWebpackPlugin(options))
}


module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  // 使用插件去判断当前端口是否可用
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        // 添加终端提示内容
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
