# vue3.*  (多页面跳转)


 @[vue2.5.2|webpack3.6.0]

>- 空白的脚手架,配置文件增加了中文注释,assets中配置了部分公共的内容,拉下来直接开发

[测试地址](http://118.24.101.230)

## 说明
- **有问题可以先提交到issue**
- **如果觉得此项目对你有所帮助，记得点击右上方的Star噢 ^_^**

## 目录结构
``` shell
.
├── README.md
├── build                              // 构建相关
│   ├── build.js
│   ├── check-versions.js
│   ├── logo.png
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── config                             // 配置相关
│   ├── dev.env.js
│   ├── index.js
│   └── prod.env.js
├── dist                              // 打包后文件
├── package-lock.json
├── package.json
├── src                               // 项目文件夹
│   ├── assets                        // 静态资源
│   ├── components                    // 公共组件
│   │   └── HelloWorld.vue
│   └── pages                         // 多页面入口
│       ├── home                      
│       │   ├── app.vue
│       │   ├── home.html
│       │   ├── home.js
│       │   ├── images
│       │   ├── router
│       │   └── views
│       └── login
│           ├── app.vue
│           ├── login.html
│           └── login.js
└── static
    ├── 123.jpg
    └── favicon.ico
  
```

## 命令
>国际惯例

- **npm install (or cnpm 其他)** 装依赖包
- **npm run dev** 起服务
- **npm run build** 打上线包
- 跑起来服务后,需要在url输入 /xx/xx.html (xx为对应文件夹名字)
- 添加了新文件夹后,需要重新 npm run dev一下
