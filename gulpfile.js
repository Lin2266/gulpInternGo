const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');


function defaultTask(cd){
    console.log('hello');
    cd();
}

exports.task = defaultTask; // gulp task

//任務A
function taskA(cd){
    console.log('a task');
    cd();
}
//任務B
function taskB(cd){
    console.log('b task');
    cd();
}

//兩個同步執行
exports.sync = parallel(taskA, taskB); // gulp sync
//兩個非同步執行，先執行第1個參數，在執行第2個參數
exports.asnyc = series(taskA, taskB); // gulp asnyc


//打包 src dest
function move(){
    //把src來源打包搬到dest(會自已建立檔案)目的地
    return src('*.html').pipe(dest('dist'))
}

exports.m = move; //gulp m打開

// rename 改名
const rename = require('gulp-rename');

const uglify = require('gulp-uglify'); //引入uglify
function Jsminify(){
    return src('js/*.js')
        .pipe(uglify()) // js uglify 壓縮跟檢查語法，邏輯要自已檢查       
        .pipe(rename({  // 改名
            extname: '.min.js'
        }))
        .pipe(dest('dist/js'));
}

exports.uglify = Jsminify;

// 
const cleanCSS = require('gulp-clean-css');
function cssminify(){
    return src('sass/*.css') // src(['sass/*.css',!""])   
    .pipe(cleanCSS()) //css minify 壓縮
    .pipe(rename({
        extname: '.min.css'
    }))
    .pipe(dest('dist/css'));
}

exports.css = cssminify;

// 3.sass 編輯跟打包
const sass = require('gulp-sass')(require('sass'));
// SourceMap 讓 css 文件可以追朔 sass，執行完，dist/css/style.css底下會有一段註解不能刪
const sourcemaps = require('gulp-sourcemaps');
function sassstyle(){
    return src('sass/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError)) // 編譯
    .pipe(cleanCSS()) // css壓縮
    .pipe(sourcemaps.write())
    .pipe(dest('dist/css')); // 打包
}

exports.style = sassstyle;
// exports.style = series(sassstyle, cssminify);// 如果css原生跟壓縮要同步處理時，先處理sass，在處理css


// 1. gulp-file-include 合併 html
const fileinclude = require('gulp-file-include');

function includeHTML() {
    return src('*.html')
        .pipe(fileinclude({
            prefix: '@@', //變數前綴字 @@include @@title，可以更改
            basepath: '@file' //固定
        }))
        .pipe(dest('./dist'));
}

exports.html = includeHTML;


//watch files
function watchfiles() {
    // watch(['*.html', '**/*.html' , '!dist/*.html'], series(includeHTML))
    watch(['*.html', 'layout/*.html'], includeHTML)
    watch(['sass/*.scss', 'sass/**/*.scss'], sassstyle);
    // watch(['js/*.js', 'js/**/*.js'], Jsminify);
}

exports.watchfile = watchfiles;

const imagemin = require('gulp-imagemin');

function min_images(){
    return src('images/*.*')
    .pipe(imagemin([
        imagemin.mozjpeg({quality: 70, progressive: true}) // 壓縮品質      quality越低 -> 壓縮越大 -> 品質越差 
    ]))
    .pipe(dest('dist/images'))
}

exports.img = min_images;

//
function img_move(){
    return src(['images/*.*', 'images/**/*.*']).pipe(dest('dist/images'));
}


// babel es6 - > es5 降轉
const babel = require('gulp-babel');

function babel5() {
    return src('js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglift()) //壓縮
        .pipe(dest('dist/js'));
}

exports.js_update = babel5;

// 清除舊檔案
const clean = require('gulp-clean');

function clear() {
  return src('dist' ,{ read: false ,allowEmpty: true })//不去讀檔案結構，增加刪除效率  / allowEmpty : 允許刪除空的檔案
  .pipe(clean({force: true})); //強制刪除檔案 
}

exports.cls = clear;


// 5.瀏覽器同步
const browserSync = require('browser-sync');
const reload = browserSync.reload;

// 虛擬server
function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000
    });
    watch(['*.html', 'layout/*.html'], includeHTML).on('change', reload) // 程式碼被修改過後，瀏覽器會在重載
    watch(['sass/*.scss', 'sass/**/*.scss'], sassstyle).on('change', reload);
    watch(['images/*.*', 'images/**/*.*'], img_move).on('change', reload);
    watch('js/*.js', Jsminify).on('change', reload);
    done();
}



// default 直接打gulp就好
// exports.default = browser;

// 最後執行
exports.default = series(parallel(includeHTML, sassstyle, img_move, Jsminify), browser);


// 上線:清除dist，html,sass,圖片壓縮，js降轉
exports.online = series(clear,parallel(includeHTML, sassstyle, min_images, babel5), browser);