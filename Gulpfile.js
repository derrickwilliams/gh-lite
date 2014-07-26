var
  gulp = require('gulp'),
  sass = require('gulp-sass'),
  watch = require('gulp-watch');

gulp.task('default', ['sass']);

gulp.task('sass', function() {
  gulp.src('./assets/css/**/*.scss')
    .pipe(watch(function(files) {
      return files.pipe(sass())
        .pipe(gulp.dest('./assets/css'));
    }));
    
});
