'use strict'
const path = require('path')
const config = require('../config')
// 打包css方法
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
// 匹配文件夹路径组件 https://www.cnblogs.com/waitforyou/p/7044171.html
const glob = require('glob')

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    // 判断是否使用postcss
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    /*
      https://www.npmjs.com/package/extract-text-webpack-plugin
      下面这一块的配置是指,是否需要使用extract这个插件,将css整体抽取出来.

      其他俩属性看一下api,
      有一个关键的配置属性.
      publicPath   这个属性是指,改写css中资源引用的路径.

      --
      如果不配置这个属性,部分例如background-image对本地文件夹图片url的引用.抽取后会导致路径出错
    */
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
        publicPath: '../../../'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

// 多页面模式的路径返回方法
exports.getEntry = function (globPath) {
  var entries = {},       //路径集合
      basename = '',      //路径的标识
      key = '',           //路径的key值
      tmp;                //处理数组

  //可以获得传入path路径下的所有文件(返回数组)
  glob.sync(globPath).forEach(function (item) {
    /*
      http://nodejs.cn/api/path.html

      path.basename(path[, ext]) 是用于返回路径的最后部分

      path.basename('/foo/bar/baz/asdf/quux.html');
      // 返回: 'quux.html'

      path.basename('/foo/bar/baz/asdf/quux.html', '.html');
      // 返回: 'quux'

      -------
      path.extname(path) 方法返回 path 的扩展名
      path.extname('index.html');
      // 返回: '.html'
    */
    basename = path.basename(item, path.extname(item));
    tmp = item.split('/').splice(3);    //默认进来的地址是 ./src/页面文件夹/***  从src后面那个开始处理
    key = tmp.shift() + '/' + basename; //获取存放页面的文件夹名称 (拼接成 页面文件夹/对应页面的格式)
    entries[key] = item;
    console.log('entries', entries)
  })

  return entries;
}
