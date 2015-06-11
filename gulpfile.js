var gulp               = require('gulp');
var browserSync        = require('browser-sync').create();
var sass               = require('gulp-sass');
var sourcemaps         = require('gulp-sourcemaps');
var babel              = require('gulp-babel');
var historyApiFallback = require('connect-history-api-fallback');
var ngAnnotate         = require('gulp-ng-annotate');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: {
      baseDir: './',
      middleware: [
          historyApiFallback()
      ]
    }
  });

  // complex tasks
  gulp.watch('assets/scss/*.scss', ['sass']);
  gulp.watch('assets/es6/*.js', ['js']);

  // watch simple files
  gulp.watch('views/*.html').on('change', browserSync.reload);
  gulp.watch('index.html').on('change', browserSync.reload);
  gulp.watch('gulpfile.js').on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src('assets/scss/*.scss')
      .pipe(sourcemaps.init())
          .pipe(sass())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('assets/css'))
      .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src('assets/es6/*.js')
      .pipe(sourcemaps.init())
          .pipe(babel())
      .pipe(sourcemaps.write())
      .pipe(ngAnnotate({ single_quotes: true }))
      .pipe(gulp.dest('assets/js'))
      .pipe(browserSync.stream());
});

gulp.task('default', ['js', 'sass', 'serve']);
