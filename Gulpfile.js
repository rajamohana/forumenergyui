
"use strict";

const gulp = require('gulp');
const sass = require('gulp-ruby-sass');
const prefix = require('gulp-autoprefixer');
const minifycss = require('gulp-minify-css');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const connect = require('gulp-connect');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const concat = require('gulp-concat');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const install = require("gulp-install");
const stripDebug = require("gulp-strip-debug");

const paths = {
  scripts: ['filters/**/*.js', 'services/**/*.js', 'directives/**/*.js', 'app.js', 'controllers/**/*.js'],
  vendor: ['vendor/lodash.js', 'vendor/jquery.js', 'vendor/d3.js', 'vendor/angular.js', 'vendor/angular-route.js',
    'vendor/angular-cookies.js', 'vendor/angular-resource.js','vendor/leaflet.js', 'vendor/oidc-client.js','vendor/angular-oidc-client.js', 'vendor/angular-animate.js',
    'vendor/angular-messages.js', 'vendor/angular-mocks.js', 'vendor/clickoutside.directive.js', 'vendor/d3-tip.js'],
  debug: 'debug.html',
  index: 'index.html',
  partials: ['templates/**/*.html'],
  sassfiles: ['sass/*.scss', 'directives/**/*.scss'],
  svgs: 'svg/*.svg',
  cssfiles: ['css/**/*.css']
};

const sassOptions = {
  style: 'expanded',
  sourcemap: true
};

gulp.task('sass', () =>
    sass(paths.sassfiles, sassOptions)
        .on('error', sass.logError)
        .pipe(prefix())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('.', {
            includeContent: false,
            sourceRoot: 'source'
        }))
        .pipe(gulp.dest('css'))
);

gulp.task('minify-vendor', function() {
  return gulp.src(paths.vendor)
    .pipe(sourcemaps.init())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(rename('vendor.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify-scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(rename('scripts.min.js'))
    .pipe(uglify())
    .pipe(stripDebug())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', ['svgstore', 'sass', 'minify-vendor', 'minify-scripts']);

gulp.task('connect', () =>
  connect.server({
      host: 'localhost',
      port: 1947,
      livereload: true
  })
);

gulp.task('svgstore', () => {
  let filename = 'sprite';
  gulp.src(paths.svgs, { base: 'src/svg' })
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(rename(`${filename}.svg`))
    .pipe(gulp.dest('assets/images/'));
});

gulp.task('packages', () =>
  gulp.src(['./bower.json', './package.json'])
    .pipe(install())
);

gulp.task('watch', () =>  {
  gulp.watch(paths.sassfiles, ['sass']);
  gulp.watch(paths.scripts, ['minify-scripts']);
});

gulp.task('default', ['packages', 'sass', 'watch', 'connect', 'minify']);
