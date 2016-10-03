var gulp      = require('gulp');
var plumber   = require('gulp-plumber');
var sass      = require('gulp-sass');
var webserver = require('gulp-webserver');
var opn       = require('opn');
var rename    = require('gulp-rename');

var sourcePaths = {
  styles: ['client/landing/styles/**/*.scss']
};

var distPaths = {
  styles: 'client/landing/css temp'
};

var server = {
  host: 'localhost',
  port: '8001'
}

gulp.task('sass', function () {
  gulp.src( sourcePaths.styles )
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(rename('styles-landing.css'))
    .pipe(gulp.dest( distPaths.styles ));
});

gulp.task('webserver', function() {
  gulp.src( '.' )
    .pipe(webserver({
      host:             server.host,
      port:             server.port,
      livereload:       true,
      directoryListing: true
    }));
});

gulp.task('openbrowser', function() {
  opn( 'http://' + server.host + ':' + server.port );
});

gulp.task('watch', function(){
  gulp.watch(sourcePaths.styles, ['sass']);
});

gulp.task('build', ['sass']);

gulp.task('default', ['build', 'webserver', 'watch', 'sass', 'openbrowser']);