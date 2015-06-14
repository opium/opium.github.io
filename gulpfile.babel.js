import gulp from 'gulp';
import sass               from 'gulp-sass';
import sourcemaps         from 'gulp-sourcemaps';
import babel              from 'gulp-babel';
import historyApiFallback from 'connect-history-api-fallback';
import ngAnnotate         from 'gulp-ng-annotate';
import browserSync        from 'browser-sync';

browserSync.create();

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], () => {

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
gulp.task('sass', () => {
  return gulp.src('assets/scss/*.scss')
      .pipe(sourcemaps.init())
          .pipe(sass())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('assets/css'))
      .pipe(browserSync.stream());
});

gulp.task('js', () => {
  return gulp.src('assets/es6/*.js')
      .pipe(sourcemaps.init())
          .pipe(babel())
      .pipe(sourcemaps.write())
      .pipe(ngAnnotate({ single_quotes: true }))
      .pipe(gulp.dest('assets/js'))
      .pipe(browserSync.stream());
});

gulp.task('default', ['js', 'sass', 'serve']);
