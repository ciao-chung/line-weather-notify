import 'Global'
import { readFileSync } from 'fs'
import GetAirBoxSnapSnapshot from 'Jobs/GetAirBoxSnapSnapshot'
import GetCwbData from 'Jobs/GetCwbData'
class App {
  constructor() {
    this.start()
  }

  async start() {
    await this.setupConfig()
    await GetAirBoxSnapSnapshot.start()
    // await GetCwbData.start()
  }

  async setupConfig() {
    try {
      const config = await readFileSync(args.config, 'utf8')
      global.appConfig = JSON.parse(config)
    } catch(error) {
      log(`找不到config檔案`, 'red')
      process.exit()
    }
  }
}

new App()