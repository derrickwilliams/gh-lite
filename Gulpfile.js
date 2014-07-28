var
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  concat = require('gulp-concat');

// gulp.task('default', ['sass']);

gulp.task('build', ['build:sass', 'build:js']);

gulp.task('build:sass', function() {
  gulp.src('./assets/css/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./assets/css'));
});

gulp.task('build:js', ['build:controllers', 'build:services'], function() {
  return gulp.src(['./assets/js/app.js', './assets/build/**/*.js', '!./assets/build/build.js'])
    .pipe(concat('build.js'))
    .pipe(gulp.dest('./assets/build/'));
});

gulp.task('build:controllers', function() {
  return gulp.src('./assets/js/controllers/**/*.js')
    .pipe(concat('controllers.js'))
    .pipe(gulp.dest('./assets/build/'));
});

gulp.task('build:services', function() {
  return gulp.src('./assets/js/services/**/*.js')
    .pipe(concat('services.js'))
    .pipe(gulp.dest('./assets/build/'));
});


