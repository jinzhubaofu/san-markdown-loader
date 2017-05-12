/**
 * @file gulpfile
 * @author leon <ludafa@outlook.com>
 */

/* eslint-disable fecs-no-require */

const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

gulp.task(
    'babel',
    () => gulp.src('src/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('lib'))
);

gulp.task('default', ['babel']);
