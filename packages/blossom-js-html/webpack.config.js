var path = require('path');

module.exports = {
  entry: './modules/index.js',
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'umd'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'blossomJsHtml'
  }
};