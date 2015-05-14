var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');

var runSequence = require('run-sequence');
var child_proc  = require('child_process');
var spawn       = child_proc.spawn;
var node;

gulp.task('browserify', function() {
    gulp.src('src/js/main.js')
      .pipe(browserify({transform: 'reactify'}))
      .pipe(concat('main.js'))
      .pipe(gulp.dest('dist/js'));
});

gulp.task('copy', function() {
    gulp.src('src/index.html')
      .pipe(gulp.dest('dist'));
});

gulp.task('copy-callback', function() {
    gulp.src('src/callback.html')
      .pipe(gulp.dest('dist'));
});

gulp.task('default',['browserify', 'copy', 'copy-callback']);

gulp.task('watch', function() {
    gulp.watch('src/**/*.*', ['default']);
});

// used for running the app node server
gulp.task('server', function() {
  if (node) {
    node.kill();
  }
  node = spawn('node', ['./server.js'], {
    stdio: 'inherit'
  });
  node.on('close', function(code) {
    if (code === 8) {
      console.log('Error detected, waiting for changes...');
    }
  });
});

// Task to run during development
gulp.task('dev', function(callback) {
  runSequence(
    'default',
    'server',
    'watch',
    callback);
});
