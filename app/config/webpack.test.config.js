const baseConfig = require('./webpack.config')
const merge = require('webpack-merge')

module.exports = () => {
  return merge(baseConfig(), {
    devtool: '#inline-source-map',
  })
}