var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'umd'),
    filename: 'index.js',
    library: 'blossomJsRouter'
  }
};