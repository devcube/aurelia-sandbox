var gulp = require('gulp');
var bundler = require('aurelia-bundler');
var bundles = require('../bundles.json');

var config = {
  force: true,
  baseURL: './server/wwwroot',
  configPath: './server/wwwroot/config.js',
  bundles: bundles.bundles
};

gulp.task('bundle', ['unbundle', 'build'], function() {
  return bundler.bundle(config);
});

gulp.task('unbundle', function() {
  return bundler.unbundle(config);
});
