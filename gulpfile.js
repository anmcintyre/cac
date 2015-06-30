var gulp = require('gulp'); 
var connect = require('gulp-connect');
var clean = require('gulp-clean');
var minifyCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var usemin = require('gulp-usemin');

var paths = {
	build: './build',
	html: ['./app/*.html',
			'!./app/index.html'],
	css:  './app/style.css',
	index:'./app/index.html'
}

//Remove files from the build directory
gulp.task('clean', function(){
	gulp.src(paths.build, {read: false})
		.pipe(clean());
});

//minify js files
gulp.task('min', ['clean'], function(){
	gulp.src(paths.index)
		.pipe(usemin({
			css: [minifyCss()],
			js: [uglify()]
		}))
		.pipe(gulp.dest(paths.build));
});

//Copy HTML files to the build directory
gulp.task('copy', ['min'], function(){
	gulp.src(paths.html)
		.pipe(gulp.dest(paths.build));
});

//Set the build argument to call minJs
gulp.task('build', ['copy']);

// connect
gulp.task('connect', function() {
  connect.server({
    root: 'app/'
  });
});
gulp.task('default', ['connect']);