const path = require('path');

module.exports = {
  entry: {
    index: path.resolve('client/entry.jsx')
  },

  output: {
    path: path.resolve('dist'),
    filename: '[name].js'
  },

  module: {
    loaders: [{
      test: /\.jsx?/,
      loader: 'babel-loader'
    }]
  }
};
