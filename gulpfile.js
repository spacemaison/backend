const gulp = require('gulp')
const gutil = require('gulp-util')
const babel = require('gulp-babel')

gulp.task('backend', () =>
  gulp.src('src/**/*.js')
    .pipe(babel({
      plugins: [ "transform-es2015-modules-commonjs" ]
    }))
    .pipe(gulp.dest('out'))
)

gulp.task('default', [ 'backend' ])
