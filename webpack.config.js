var path = require('path');
const webpack = require("webpack");

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
      {
        test : /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test : /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
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

const checkoutClient = {
  entry: './checkout-client.js',
  output: {
    path: __dirname + '/public',
    filename: 'checkout-app.js'
  }
};

const checkoutServer = {
  entry: './checkout-server.js',
  target: 'node',
  output: {
    path: __dirname + '/public',
    filename: 'checkout-app-server.js',
    libraryTarget: 'commonjs-module'
  }
};

module.exports = [
  Object.assign({}, common, descClient),
  Object.assign({}, common, descServer),
  Object.assign({}, common, checkoutClient),
  Object.assign({}, common, checkoutServer)
];


