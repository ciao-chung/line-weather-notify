require('../src/Global')
const asyncWebpackConfig = require('../config/webpack.test.config')
const webpack = require('webpack')
const spinner = require('ora')('Start Build App')

class dev {
  constructor() {
    this.start()
  }

  async start() {
    this.startWebpack()
  }

  startWebpack() {
    return new Promise((resolve) => {
      webpack(asyncWebpackConfig(), (error, stats) => {
        spinner.stop()
        if(!error) {
          log('Build Success')
          notify('Build Success')
        }

        else {
          log(`Build Fail: ${error}`, 'red')
          notify(`Build Fail: ${error}`)
        }

        resolve()
      })
    })
  }
}

module.exports = new dev()