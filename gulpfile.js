var gulp = require('gulp');
// var jshint = require('gulp-jshint');
//var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');

// // Lint JS
// gulp.task('lint', function() {
//   return gulp.src('src/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('default'));
// });

//Minify CSS
gulp.task('minifyCSS', function(){
  return gulp.src('public//stylesheets//*.css')  
    .pipe(cssmin())
    .pipe(rename('map.min.css'))
    .pipe(gulp.dest('dist//public//stylesheets'));
});

// Concat & Minify JS
gulp.task('minifyJS', function(){
  return gulp.src('public//javascripts//*.js')  
    .pipe(uglify())
    .pipe(rename('map.min.js'))
    .pipe(gulp.dest('dist//public//javascripts'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('*.js', ['minifyJS']);
    gulp.watch('*.css', ['minifyCSS']);
});

// Default
// gulp.task('default', ['lint', 'minify', 'watch']);
gulp.task('default', ['minifyJS', 'minifyCSS', 'watch']);