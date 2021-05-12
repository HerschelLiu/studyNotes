## 前言

微信小程序开发者工具本身就可以直接创建Typescript的项目

## 准备

0. 全局安装`gulp``(c)npm install gulp-cli -g`
1. 微信开发者工具创建项目，语言使用`TypeScript`
2. 进入项目根目录，`(c)npm install gulp -D`
3. 根目录创建`gulpfile.js`

    ```js
    // gulpfile.js
    const gulp = require('gulp')
    const rename = require('gulp-rename')
    const sass = require('gulp-sass')
    const bulkSass = require('gulp-sass-bulk-import')
    const htmlmin = require('gulp-htmlmin')
    const minify = require('gulp-minify')
    const clean = require('gulp-clean')
    const replace = require('gulp-replace')
    
    gulp.task('clear', done => {
      gulp.src('dist/', { read: false, allowEmpty: true })
        .pipe(clean())
      done()
    })
    
    gulp.task('wxml', function() {
      return gulp.src('./miniprogram/**/*.wxml', { 'base': '' })
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true, keepClosingSlash: true, caseSensitive: true }))
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('json', function() {
      return gulp.src('./miniprogram/**/*.json', { 'base': '' })
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('js', function() {
      return gulp.src('./miniprogram/**/*.js', { 'base': '' })
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('wxss', function() {
      return gulp.src('./miniprogram/**/*.wxss', { 'base': '' })
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('wxs', function() {
      return gulp.src('./miniprogram/**/*.wxs', { 'base': '' })
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('png', function() {
      return gulp.src('./miniprogram/**/*.png', { 'base': '' })
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('scss', function() {
      return gulp.src('./miniprogram/**/*.scss', { 'base': '' })
        .pipe(bulkSass())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename({
          extname: '.wxss'
        }))
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('mini', function() {
      return gulp.src('./dist/**/*.js', { 'base': '' })
        .pipe(minify({
          ext: {
            min: [/(.*)\.js$/, '$1.js']
          },
          mangle: false,
          noSource: true,
          exclude: ['tasks']
        }))
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('version', function() {
      return gulp.src('./dist/**/*.js', { 'base': '' })
        .pipe(replace('___version___', `${ new Date().getFullYear() }.${ (new Date().getMonth() + 1).toString().padStart(2, '0') }.${ new Date().getDate().toString().padStart(2, '0') }`))
        .pipe(gulp.dest('dist'))
    })
    
    gulp.task('watch', function() {
      gulp.watch('./miniprogram/**/*.wxml', gulp.series('wxml'))
      gulp.watch('./miniprogram/**/*.json', gulp.series('json'))
      gulp.watch('./miniprogram/**/*.scss', gulp.series('scss'))
      gulp.watch('./miniprogram/**/*.wxss', gulp.series('wxss'))
      gulp.watch('./miniprogram/**/*.wxs', gulp.series('wxs'))
      gulp.watch('./miniprogram/**/*.js', gulp.series('js'))
      gulp.watch('./miniprogram/**/*.png', gulp.series('png'))
    })
    
    gulp.task('default', gulp.series(['wxml', 'json', 'wxss', 'wxs', 'scss', 'js', 'png'], 'watch'))
    
    ```

```json
// package.json
{
  "name": "mini-program",
  "version": "1.0.0",
  "scripts": {
    "tsc": "tsc -w",
    "gulp": "gulp",
    "lint": "eslint --ext .ts,.wxml miniprogram",
    "dev": "gulp clear && concurrently \"npm run tsc\" \"npm run gulp\"",
    "build:tsc": "node ./node_modules/typescript/lib/tsc.js",
    "build:gulp": "gulp wxml json wxss wxs scss js png version && gulp mini",
    "build": "gulp clear && npm run build:tsc && npm run build:gulp"
  },
  "devDependencies": {
    "@vue/cli-plugin-eslint": "^4.1.2",
    "@vue/eslint-config-standard": "^4.0.0",
    "@vue/eslint-config-typescript": "^4.0.0",
    "babel-eslint": "^10.0.3",
    "concurrently": "^5.3.0",
    "eslint": "^6.5.1",
    "eslint-plugin-vue": "^5.2.3",
    "gulp": "^4.0.2",
    "gulp-clean": "^0.4.0",
    "gulp-htmlmin": "^5.0.1",
    "gulp-minify": "^3.1.0",
    "gulp-rename": "^2.0.0",
    "gulp-replace": "^1.0.0",
    "gulp-sass": "^4.1.0",
    "gulp-sass-bulk-import": "^1.0.1",
    "gulp-sass-glob-import": "^0.1.0",
    "node-sass": "^4.14.1",
    "typescript": "^3.2.1"
  },
  "dependencies": {
    "@types/node": "^14.14.30"
  }
}

```

