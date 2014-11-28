var path = require("path");

var webpack = require("webpack");

module.exports = function(environment) {
  "use strict";

  var plugins = [
    new webpack.NoErrorsPlugin()
  ];
  return {
    output: {
      filename: "frontend.js",
      path: path.join(__dirname, "public/javascripts")
    },

    cache: true,
    debug: true,
    devtool: false,
    entry: [ path.join(__dirname, "src/frontend/main.js") ],

    externals: { },

    stats: {
      colors: true,
      reasons: true
    },

    resolve: {
      extensions: ["", ".js", ".jsx"],
      modulesDirectories: [ "src", "node_modules" ]
    },

    module: {
      loaders: []
    },

    plugins: plugins
  };

};
