const path = require('path');
// CSS 檔案額外輸出到一個 .css 檔案裡面的話，要額外再使用其他的 loader。
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// HTML的注入
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 清除建構檔案
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

// 有版本衝突時，把node_modules、package-lock、npm i重新安裝

module.exports = {
    entry: {index :'./src/js/index.js'}, // index 資源的id，chunks : ['index']
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },              // 出口文件
    module: { //sass loader 使用
        rules: [{
            // 格式
            test: /\.(sass|scss|css)$/,
            //順序是由下到上 sass > css > style
            use: [{
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: './dist'
                }
              },
                'css-loader',
                'sass-loader'
            ],
        }]

    },
    plugins: [
        //清理舊的檔案，清除以後dist裡的檔案會被清掉，執行上線的webpack -p就會重新打包dist
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "./[name].css"
        }),
        new HtmlWebpackPlugin({
            chunks : ['index'],  //選擇注入資源 chunk
            inject  : 'body', //預設<body> js </body>  head or body
            template : './src/index.html',
            // 來源
            filename : 'index.html'
            // 目的地
        })

    ], 
    // 服務器配置，安裝: npm install webpack-dev-server@3.11.3 -g
    devServer: {
        contentBase: './dist',
        host: 'localhost',
        port: 3100,
        // 指定首頁檔案
        index: 'index.html',
        open: true
    },           
    mode: 'development'      // 開發模式配置
}

// 設定完 執行 webpack, dist會產出bundle.js