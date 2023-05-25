```js
const gulp = require('gulp')
const rename = require('gulp-rename') // 重命名（前缀，后缀。。。）
const sass = require('gulp-sass')
const bulkSass = require('gulp-sass-bulk-import')
const htmlmin = require('gulp-htmlmin') // HTML文件压缩插件
const uglify = require('gulp-uglify') // js压缩插件
const clean = require('gulp-clean') // 清除文件及文件夹
const replace = require('gulp-replace') // 替换目标文件中的文本
var minimist = require('minimist') // 解析命令行选项的库
var fs = require('fs-plus')


gulp.task('clear', done => {
  gulp.src('dist/', { read: false, allowEmpty: true }).pipe(clean())
  done()
})

gulp.task('npm', function () {
  return gulp.src('./miniprogram/**/miniprogram_npm/**', { base: '' }).pipe(gulp.dest('dist'))
})

gulp.task('wxml', function () {
  return gulp
    .src(['./miniprogram/**/*.wxml', '!./miniprogram/**/miniprogram_npm/**'], { base: '' })
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true, keepClosingSlash: true, caseSensitive: true }))
    .pipe(gulp.dest('dist'))
})

gulp.task('json', function () {
  return gulp.src(['./miniprogram/**/*.json', '!./miniprogram/**/miniprogram_npm/**'], { base: '' }).pipe(gulp.dest('dist'))
})

gulp.task('js', function () {
  return gulp.src(['./miniprogram/**/*.js', '!./miniprogram/**/miniprogram_npm/**'], { base: '' }).pipe(gulp.dest('dist'))
})

gulp.task('wxss', function () {
  return gulp.src(['./miniprogram/**/*.wxss', '!./miniprogram/**/miniprogram_npm/**'], { base: '' }).pipe(gulp.dest('dist'))
})

gulp.task('wxs', function () {
  return gulp.src(['./miniprogram/**/*.wxs', '!./miniprogram/**/miniprogram_npm/**'], { base: '' }).pipe(gulp.dest('dist'))
})

gulp.task('png', function () {
  return gulp
    .src(
      [
        './miniprogram/**/*.png',
        './miniprogram/**/*.jpg',
        './miniprogram/**/*.jpeg',
        './miniprogram/**/*.gif',
        '!./miniprogram/**/miniprogram_npm/**'
      ],
      { base: '' }
    )
    .pipe(gulp.dest('dist'))
})

gulp.task('scss', function () {
  return gulp
    .src(['./miniprogram/**/*.scss', '!./miniprogram/**/miniprogram_npm/**'], { base: '' })
    .pipe(bulkSass())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(
      rename({
        extname: '.wxss'
      })
    )
    .pipe(gulp.dest('dist'))
})

gulp.task('uglify', function () {
  return gulp
    .src(['./dist/**/*.js', '!./miniprogram/**/miniprogram_npm/**'], { base: '' })
    .pipe(
      uglify({
        compress: false,
        mangle: true
      })
    )
    .pipe(gulp.dest('dist'))
})

var knownOptions = {
  string: 'env',
  default: {
    env: 'dev'
  }
}
var options = minimist(process.argv.slice(2), knownOptions)

gulp.task('env', function (done) {
  try {
    const targetFile = fs.readFileSync('./dist/settings.js', 'utf-8')
    if (!(targetFile.includes('___env___') || targetFile.includes('___version___'))) {
      return done()
    }
  } catch (error) {
    // nothing
  }
  const file = fs.readFileSync('package.json', 'utf-8')
  return gulp
    .src(['./dist/settings.js'], { base: '', allowEmpty: true })
    .pipe(replace('___env___', options.env))
    .pipe(replace('___version___', JSON.parse(file).version))
    .pipe(gulp.dest('dist'))
})

gulp.task('watch', function () {
  gulp.watch('./miniprogram/**/miniprogram_npm/**', gulp.series('npm'))
  gulp.watch(['./miniprogram/**/*.wxml', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('wxml'))
  gulp.watch(['./miniprogram/**/*.json', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('json'))
  gulp.watch(['./miniprogram/**/*.scss', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('scss'))
  gulp.watch(['./miniprogram/**/*.wxss', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('wxss'))
  gulp.watch(['./miniprogram/**/*.wxs', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('wxs'))
  gulp.watch(['./miniprogram/**/*.js', '!./miniprogram/**/miniprogram_npm/**'], gulp.series('js'))
  gulp.watch(
    ['./miniprogram/**/*.png', './miniprogram/**/*.jpg', './miniprogram/**/*.jpeg', './miniprogram/**/*.gif', '!./miniprogram/**/miniprogram_npm/**'],
    gulp.series('png')
  )
  gulp.watch(['./dist/**/settings.js'], gulp.series('env'))
})

gulp.task('default', gulp.series(['npm', 'wxml', 'json', 'wxss', 'wxs', 'scss', 'js', 'png', 'env'], 'watch'))
```

