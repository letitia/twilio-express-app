const path = require('path');

module.exports = {
  devtool: 'source-map',

  entry: {
    index: path.resolve('client/index.jsx'),
    conference: path.resolve('client/conference.jsx')
  },

  module: {
    loaders: [{
      test: /\.jsx?/,
      loader: 'babel-loader',
    }]
  },

  output: {
    path: path.resolve('dist'),
    filename: '[name].js'
  }
};
