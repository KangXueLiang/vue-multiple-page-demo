'use strict'
// 生产环境配置文件

const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
// 基础设置配置文件
const baseWebpackConfig = require('./webpack.base.conf')
// webpack 复制文件和文件夹的插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 自动生成 html 并且注入到 .html 文件中的插件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 整合css的工具 https://github.com/webpack-contrib/extract-text-webpack-plugin
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 压缩提取出的css 并解决ExtractTextPlugin分离出的重复问题
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// 压缩代码
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const env = require('../config/prod.env')

// 多页面html路径集合
const pages = utils.getEntry('./src/pages/*/*.html');

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    /*
      在utils.js已经配置好相关对extractTextPlugin的css抽取配置.通过extract: true即可触发

      如果要触发这个 extract 需要在plugins里面注册一下
    */
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  // 检测生产环境下是否生成source map(并且生成的模式是怎么样)
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // 指的是通过CommonsChunkPlugin提取出来模块的命名规则
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // 定义全局变量
    new webpack.DefinePlugin({
      'process.env': env
    }),

    // https://doc.webpack-china.org/plugins/uglifyjs-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
    new UglifyJsPlugin({
      // 压缩uglify的配置
      uglifyOptions: {
        compress: {
          // 压缩后删除没有用到的代码时不输出警告
          warnings: false
        }
      },
      // 是否使用sourcemap做关联
      sourceMap: config.build.productionSourceMap,
      // 压缩代码中是否使用多进程进行构建
      parallel: true
    }),
    
    // 将每个模块的css提取到一个文件里面
    new ExtractTextPlugin({
      // 提取出来的文件名称
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),

    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // 删除重复的css内容
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? { safe: true, map: { inline: false } }
        : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin

    /*
      https://doc.webpack-china.org/plugins/html-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
    */
    // new HtmlWebpackPlugin({
    //   // 生成html的名称
    //   filename: config.build.index,
    //   template: 'index.html',
    //   // 这个配置项指js文件插入的位置 
    //   inject: true,
    //   // 额外的精简配置项
    //   minify: {
    //     // 删去html中的注释项
    //     removeComments: true,
    //     // 折叠html中的空白字符
    //     collapseWhitespace: true,
    //     // 删去不必要的属性
    //     removeAttributeQuotes: true
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    //   // 控制生成的js插入位置的顺序(可以结合chunks进行选择)
    //   chunksSortMode: 'dependency'
    // }),

    // keep module.id stable when vendor modules does not change
    // 该插件会根据模块的相对路径生成一个四位数的hash作为模块id
    new webpack.HashedModuleIdsPlugin(),

    // enable scope hoisting
    /*
      https://doc.webpack-china.org/plugins/module-concatenation-plugin/#src/components/Sidebar/Sidebar.jsx
      webpack3.0 新特性,
      从原本的每个bundle模块打包成多个单独闭包去调用,
      变为现在的在一个大闭包里面去调用各个模块,
      提升了效率
    */
    new webpack.optimize.ModuleConcatenationPlugin(),

    // split vendor js into its own file
    /*
      提取公共模块(将公共的import模块 提取到一个文件中.)
      https://doc.webpack-china.org/plugins/commons-chunk-plugin
      
    */
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      // 模块被抽离出来至vendor文件中的判断
      minChunks (module) {
        /*
          一般来讲这里的module会返回整个项目所用到的组件库包,和import的东西
          然后通过这个函数去控制一下哪一些放入vendor的文件

          可以通过具体的数值或者Boolean值来控制抽取的颗粒度.
          返回true, 是会将所有的import模块都提取,
          返回false,是将重复的提取出来,
          具体的数值,就会作为调用模块的次数 来提取,

        */
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    /*
      https://doc.webpack-china.org/concepts/manifest/
      当编译器(compiler)开始执行、解析和映射应用程序时，设置好的 /src文件夹就会被打散
      但会保留所有模块的详细要点。这个数据集合称为 "Manifest"
      当完成打包并发送到浏览器时，会在运行时通过 Manifest 来解析和加载模块。

      如果不提取manifest的数据,每次build打包 上面vendor文件的hash值也会被改变,导致如果发版本,
      未改变vendor的代码因为hash改变 缓存也会被干掉
    */
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      // 传入 `Infinity` 会马上生成 公共独立文件
      minChunks: Infinity
    }),
    
    /*
      https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
      通过children和async属性,
      将那种又被父组件和子组件一起公用的模块抽取出来,
    */
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'app',
    //   // (创建一个异步 公共chunk)
    //   async: 'vendor-async',
    //   children: true,
    //   // (在提取之前需要至少三个子 chunk 共享这个模块)
    //   minChunks: 3
    // }),

    /*
      https://doc.webpack-china.org/plugins/copy-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
      这个插件是用于复制文件和文件夹,在这里是将静态文件夹的内容拷贝一份在开发环境中

      new CopyWebpackPlugin([patterns], options)
      A pattern looks like: { from: 'source', to: 'dest' }
    */
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        // 忽略拷贝的内容(具体的文件名或模糊的路径)
        ignore: ['tpl/*'] //不打包模板文件夹
      }
    ])
  ]
})

// gzip压缩
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

// bundle分析
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

for(let pathName in pages){
  /*
    https://doc.webpack-china.org/plugins/html-webpack-plugin/#src/components/Sidebar/Sidebar.jsx
  */
  let options = {// 生成html的名称
    filename: `${pathName}.html`,
    template: pages[pathName],
    // 这个配置项指js文件插入的位置 
    inject: true,
    // 额外的精简配置项
    minify: {
      // 删去html中的注释项
      removeComments: true,
      // 折叠html中的空白字符
      collapseWhitespace: true,
      // 删去不必要的属性
      removeAttributeQuotes: true
      // https://github.com/kangax/html-minifier#options-quick-reference
    },
    // 控制生成的js插入位置的顺序(可以结合chunks进行选择)
    chunksSortMode: 'dependency'
  }

  //判断处理的路径是否在入口配置里
  if(pathName in webpackConfig.entry){
    options.chunks = ['manifest', 'vendor', pathName];
    // 加上hash值进行缓存处理
    options.hash = true;
  }

  webpackConfig.plugins.push(new HtmlWebpackPlugin(options))
}

module.exports = webpackConfig
