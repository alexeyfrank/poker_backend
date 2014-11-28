var gulp = require("gulp");
var webpack = require("gulp-webpack");
var webpackConfig = require("./webpack.config.js");

var srcPath = "./src/frontend/main.js";
var destPath = "./public/javascripts/";

gulp.task("default", ["watch"]);

gulp.task("assets_precompile", function() {
  return gulp.src(srcPath)
  .pipe(webpack(webpackConfig()))
  .pipe(gulp.dest(destPath));
});


gulp.task("watch", ["assets_precompile"], function() {
  gulp.watch("./src/frontend/**/*", ["assets_precompile"]);
});
