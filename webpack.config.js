var path = require('path');
const webpack = require("webpack");
var SRC_DIR = path.join(__dirname, '/client');
var DIST_DIR = path.join(__dirname, '/public');

// See: https://stackoverflow.com/questions/37788142/webpack-for-back-end

const common = {
  context: __dirname + '/client',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'env']
        },
      },
    ],
  }, 
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ]
};

const descClient = {
  entry: './desc-client.js',
  output: {
    path: __dirname + '/public',
    filename: 'desc-app.js'
  }
};

const descServer = {
  entry: './desc-server.js',
  target: 'node',
  output: {
    path: __dirname + '/public',
    filename: 'desc-app-server.js',
    libraryTarget: 'commonjs-module'
  }
};

module.exports = [
  Object.assign({}, common, descClient),
  Object.assign({}, common, descServer)
];


