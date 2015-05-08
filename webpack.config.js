/*jslint node: true */
/*jslint esnext: true*/
"use strict";
					
var webpack = require('webpack');

module.exports = {
    context: __dirname + "/src",
      plugins: [
          new webpack.NewWatchingPlugin()
    ],
    entry: "./entry",
    output: {
        path: __dirname + "/dist",
        filename: "turfcut.js",
        libraryTarget: "umd",
        // name of the global var: "Foo"
        library: "TurfCut"
    },
    module: {
        loaders: [                    
          { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
        ],
    },
    resolve: {
        // Allow require('./blah') to require blah.js
        extensions: ['', '.js']
    }//,
    //externals: {
       // react: 'React'
    //}
};
