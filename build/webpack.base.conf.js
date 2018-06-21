'use strict'
// 基础配置文件

const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

// 定义的路径拼接方法(join直接的拼接, path.resolve等于在终端输入路径)
function resolve (dir) {
  // http://nodejs.cn/api/path.html#path_path_join_paths
  return path.join(__dirname, '..', dir)
}

const entries = utils.getEntry('./src/pages/*/*.js');

/*
    __dirname 指的是当前你这个当前文件在 硬盘文件夹全路径 
    例如这个base.conf.js文件是在 build文件夹里
    那么 __dirname = /硬盘路径/build
*/

module.exports = {
  // 基础目录，绝对路径，用于从配置中解析入口起点
  context: path.resolve(__dirname, '../'),
  /*
    起点或是应用程序的起点入口。从这个起点开始，应用程序启动执行。如果传递一个数组，那么数组的每一项都会执行。

    如果是多入口的情况
    entry: {
      home: "./home.js",
      about: "./about.js",
      contact: "./contact.js"
    }

    入口对象的key值是结合dev.conf.js中的HtmlWebpackPlugin 作为url访问的路径
    例如
    entry: {
      home: "./home.js"
    }
    访问路径:localhost:port/home.html

    entry: {
      fgh/home: './home.js'
    }
    访问路径:localhost:port/fgh/home.html

  */
  entry: entries,
  // 输出
  output: {
    // 编译输出的静态资源根路径
    path: config.build.assetsRoot,
    // 此选项决定了每个输出 bundle 的名称。 
    // [name]是指入口名称 [id]是指chunk id [hash]是指构建完的hash [chunkhash]是指每个内容的hash
    filename: '[name].js',
    // 正式发布环境下编译输出的上线路径的根路径
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  // 选项能设置模块如何被解析
  resolve: {
    // 自动补全对应模块的后缀
    extensions: ['.js', '.vue', '.json'],
    // 路径别名
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'assets': resolve('src/assets'),
      'components': resolve('src/components'),
      'static': resolve('static')
    }
  },
  /*
    https://doc.webpack-china.org/plugins/provide-plugin/#src/components/Sidebar/Sidebar.jsx
    ProvidePlugin 可以全局加载模块,例如下面如果想全局加载一个jq, 但需要在使用前 npm install jquery --save
  */
  // plugins: [
  //   new webpack.ProvidePlugin({
  //     $: 'jquery'  
  //   })
  // ],
  
  // 各种loader的配置
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      /*
        关于.babelrc的配置 
        部分可参考
        https://segmentfault.com/a/1190000008159877
        https://babeljs.cn/docs/plugins/preset-env/
        https://doc.webpack-china.org/loaders/babel-loader/

        1.babel-preset-env 是指动态的require浏览器所缺的转换babel插件.
        这个动态是通过文件里面的配置,
        "env", {
          //是否将模块编译为 amd cmd commonjs等
          "modules": false,
          "targets": {
            //指浏览器最新的2个版本 或者safari大于7的版本 >5%是指 市场率超过5%的浏览器 (这里是指通过下面的目标版本查看哪一些api还没有,就自动带上)
            "browsers": ["last 2 versions", "safari >= 7"]
          }
        }
        如果用了env 没有加任何配置的话 那么默认与 babel-preset-latest一样

        2.babel-preset-stage 有4个版本
        Stage 0 - 稻草人: 只是一个想法，可能是 babel 插件。
        Stage 1 - 提案: 初步尝试。
        Stage 2 - 初稿: 完成初步规范。
        Stage 3 - 候选: 完成规范和浏览器初步实现。
        Stage 4(隐藏版本表示已经完成 将会在新的一版所发布) 等同于es2015 es2016...

        3.在plugin中有 babel-plugin-transform-runtime 是动态的模块加载所需的转换模块
        因为如文档所说
        Babel 几乎可以编译所有时新的 JavaScript 语法，但对于 APIs 来说却并非如此。
        例如： Promise、Set、Map 等新增对象，Object.assign、Object.entries等静态方法。

        --说到runtime就会提到babel-polyfill
        (babel-polyfill 的做法是将全局对象通通污染一遍)

        babel-runtime 更像是分散的 polyfill 模块，只会在模块里单独引入需要用到的api, 不会影响全局,
        例子: 在模块中 import Promise from 'babel-runtime/core/promise'

        但是每个模块单独这样引入也是麻烦, 所以可以通过配置babel-plugin-transform-runtime来简单操作

        --- 有一个小细节大家注意
        api中说到, babel-plugin-transform-runtime默认是和babel-runtime捆绑出现, 前面是开发依赖,后面是生产依赖.
        但是vue-cli构造出来的项目中,package.json里面并没有在生产依赖中出现babel-runtime??

        后面请教了人,
        原来在node_module中 babel-plugin-transform-runtime这个包里面的package.json里面已经把babel-runtime加入了生产.
        所以当install的时候会自动将一连串的东西都装上!!

        4.还有一个缩短build的构造时间, 在下面的babel-loader里面去 exclude掉整个 node_modules的文件夹. 可以缩短1半时间..
      */
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // 限制300kb以下的图片均变为base64. 不然如果使用background-image 打包之后会找不到资源
          // limit: 307200,
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  /*
    https://doc.webpack-china.org/configuration/node/#node
    每个属性都是 Node.js 全局变量或模块的名称
    true：提供 polyfill。
    false: 什么都不提供。
    "empty"：提供空对象。
  */
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
