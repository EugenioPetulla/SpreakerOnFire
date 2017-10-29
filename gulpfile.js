/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
browserSync = require('browser-sync').create();
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Compile scss
gulp.task('sass', function () {
  return gulp.src('./sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

// Minify and rename css
gulp.task('minify-css', ['sass'], function() {
  return gulp.src(['./css/*.css', '!./css/*.min.css'])
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./css'));
});

// Live reload task
gulp.task('live-reload', ['minify-css'], function(done) {
    browserSync.reload();
    done();
});

// Create a default chained task
gulp.task('default', ['sass', 'minify-css', 'browser-sync'], function() {
	gulp.watch(['./sass/*.scss', './css/*.css', '*.html', './js/*.js'], ['sass', 'minify-css', 'live-reload']);
});