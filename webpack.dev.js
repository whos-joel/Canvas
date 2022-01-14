const merge = require('webpack-merge');
const common = require('./webpack.common.js');

sourceMap = true;

module.exports = merge(common, {
    mode: 'development',
    devtool: 'source-map',
});