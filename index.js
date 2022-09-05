console.log('webpack ok');
// 1.webpack 最好使用 node > 9 以上
// 如何安裝
// 你需要全域安裝來使用 webpack 大部分的功能：

// 全域安裝 (管理者權限)
// 1 npm install webpack@4.43.0 -g
// 2npm install webpack-cli@3.3.12 -g
// webpack 專案裡安裝
// npm init -y --> package.json
// npm install --save-dev webpack@4.43.0

// 查詢版本
// webpack -v
// webpack-cli -v

// 檔案名稱會自動打包檔案
// webpack app.js 

// 打包出來
// dist/main.js 

// -p 產品模式
// -d 開發模式
// -w 監看
// 打開 webpack index.js
// npm i jquery 安裝
import $ from 'jquery';
import {gsap} from 'gsap';

$('body').css('background-color', 'red');
gsap.to('.box',{
    x : 400,
    y : 200,
    duration : 4,
    rotation : 270,
    scale : 2,
    backgroundColor : 'yellow',
    borderRadius : '50%',
    repeat : -1,
    yoyo : true
})