var path = require('path');

module.exports = {
  entry: './modules/index.js',
  output: {
    path: path.resolve(__dirname, 'umd'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'blossomJsCustomElement'
  }
};