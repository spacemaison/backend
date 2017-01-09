const gulp = require('gulp')
const standard = require('gulp-standard')
const babel = require('gulp-babel')

const SRC_FILES = [
  'src/**/*.js'
]

gulp.task('lint', () =>
  gulp.src(SRC_FILES)
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true
    }))
)

gulp.task('backend', [ 'lint' ], () =>
  gulp.src(SRC_FILES)
    .pipe(babel({
      plugins: [ 'transform-es2015-modules-commonjs' ]
    }))
    .pipe(gulp.dest('out'))
)

gulp.task('default', [ 'backend' ])
