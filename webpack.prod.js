const merge = require('webpack-merge');
const common = require('./webpack.common.js');

sourceMap = false;

module.exports = merge(common, {
  mode: 'production',
});