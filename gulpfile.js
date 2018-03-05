var gulp = require('gulp');
var gutil = require('gulp-util');
var connect = require('gulp-connect');

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var scss = require('postcss-scss');
var postcssProcessors = [
  autoprefixer( { browsers: ['last 2 versions', 'ie > 10'] } )
]

var nunjucksRender = require('gulp-nunjucks-render');
var data = require('gulp-data');
var globalData = {
  data: require('./src/data/data.json')
}

// generate main.css
gulp.task('addCSS', function(callback) {
    return gulp.src('src/sass/main.scss')
        .pipe(
           postcss(postcssProcessors, {syntax: scss})
        )
        .pipe(
            sass({ outputStyle: 'compact' })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest('build/css/'));
});

// generate index.html
gulp.task('nunjucks', ['addCSS'], function() {
    return gulp.src('src/*.nunjucks')
        .pipe(data(function() {
            return globalData
        }))
        .pipe(
            nunjucksRender({
                path: ['src/', 'build/css/']
            })
            .on('error', gutil.log)
        )
        .pipe(gulp.dest('build/'));
});

// set up server
gulp.task('connect', function() {
    connect.server({
        port: 8000,
        root: 'build',
        livereload:true
    });
});

// watch files
var filesToWatch = [
    'src/sass/*.scss',
    'src/partials/*.nunjucks',
    'src/*.nunjucks'
]

gulp.task('watch', function() {
    gulp.watch(filesToWatch, ['nunjucks']);
});

// run
gulp.task('default', ['connect', 'nunjucks', 'watch']);
