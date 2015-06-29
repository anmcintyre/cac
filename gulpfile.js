var gulp = require('gulp'); 
var connect = require('gulp-connect');
var clean = require('gulp-clean');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');

var paths = {
	build: './build',
	html: './app/*.html',
	build: '.build/',
	css: './app/style.css',
	js: './index.js'
}

//Remove files from the build directory
gulp.task('clean', function(){
	gulp.src(paths.build, {read: false})
		.pipe(clean());
});

//Copy HTML files to the build directory
gulp.task('copy', ['clean'], function(){
	gulp.src(paths.html)
		.pipe(gulp.dest(paths.build));
});

//Minify css files
gulp.task('minCss', [ 'copy' ], function(){
  gulp.src( paths.css )
    .pipe(minifyCss());
    .pipe(gulp.dest( paths.build ));
});

//minify js files
gulp.task('minJs', ['minCss'], function(){
	gulp.src(paths.js)
		.pipe(uglify())
		.pipe(gulp.dest(paths.build));
});

//Set the build argument to call minJs
gulp.task('build', ['minJs']);

// connect
gulp.task('connect', function() {
  connect.server({
    root: 'app/'
  });
});
gulp.task('default', ['connect']);