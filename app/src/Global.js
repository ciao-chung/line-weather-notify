require('shelljs/global')
const shelljs = require('shelljs')
const chalk = require('chalk')
const moment = require('moment')
const yargsParser = require('yargs-parser')
const notifier = require('node-notifier')

class Global {
  constructor() {
    this.init()
  }

  setupEnvVariable() {
    global.pathResolve = require('path').resolve
    global.projectRoot = pathResolve(__dirname, '../../')
    global.projectConfig = require('../../project')
    global.appRoot = pathResolve(projectRoot, 'app')
    global.outputPath = pathResolve(appRoot, 'dist')
    global.productionPath = pathResolve(projectRoot, 'prod')
  }

  /**
   * log style(white, red, green, yellow, cyan, magenta)
   */
  log(content, style = 'cyan') {
    const result = typeof content == 'object' || typeof content == 'array'
      ? JSON.stringify(content)
      : content

    console.log(chalk[`${style}Bright`](result)+chalk.whiteBright(`\t at ${now()}`))
  }

  now() {
    return moment(new Date).format('YYYY-MM-DD HH:mm:ss')
  }

  execAsync(command, options = {}, quiet = false) {
    let computedOptions = {
      async: true,
      ...options,
    }

    if(!quiet) log(`RUN: ${command}`)
    if(options.cwd) log(`cwd: ${options.cwd}`)

    return new Promise((resolve, reject) => {
      if(args.debug) {
        resolve()
        return
      }

      try {
        shelljs.exec(command, computedOptions, async(code, stdout, stderr) => {
          if(code != 0) {
            log(stderr, 'red')
            return reject({
              type: 'error',
              log: stderr,
            })
          }

          return resolve({
            type: 'success',
            log: stdout,
          })
        })
      } catch(error) {
        log(`Execute Command Fail: ${error}`, 'red')
        return reject({
          type: 'error',
          log: error,
        })
      }
    })
  }

  notify(message) {
    notifier.notify({
      title: projectConfig.name,
      message,
      icon: pathResolve(appRoot, 'assets/logo.png')
    })
  }

  async init() {
    global.chalk = chalk
    global.now = this.now
    global.log = this.log
    global.notify = this.notify
    global.execAsync = this.execAsync
    global.args = yargsParser(process.argv.slice(2))
    delete global.args._
    this.setupEnvVariable()
  }
}

new Global()