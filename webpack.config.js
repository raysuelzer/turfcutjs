/*jslint node: true */
/*jslint esnext: true*/
"use strict";
					
var webpack = require('webpack');

module.exports = {
    context: __dirname + "/src",
      plugins: [
          new webpack.OldWatchingPlugin()
    ],
    entry: "./entry",
    output: {
        path: __dirname + "/dist",
        filename: "turfcut.js",
        libraryTarget: "umd",
        library: "TurfCut"
    },
    module: {
        loaders: [                    
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ],
    },
    resolve: {
        extensions: ['', '.js']
    }
};
