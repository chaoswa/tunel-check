const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {
    // 基本路径
    baseUrl: './',
    // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,

    chainWebpack:  config => {
        config.entry.app = ["babel-polyfill", resolve('src/main.js')]
    },
    
    devServer: {
        proxy: {
            '/app': {
                target: 'http://yingyan.baidu.com/api/v3/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                  '^/app': ''
                }
            },
            '/api': {
                // target: 'http://192.168.222.115:8765',
                // target: 'http://27.17.32.34:16314',
                target: 'http://115.231.197.122:6312',
            }
        }
    }
}