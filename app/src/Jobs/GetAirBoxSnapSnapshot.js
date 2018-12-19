import puppeteer from 'puppeteer'
class GetAirBoxSnapSnapshot {
  constructor() {
    this.url = 'https://airbox.edimaxcloud.com'
  }
  async start() {
    await this._launchBrowser()
    await this._gotoAirBoxPage()
    await this._closeLightBox()
    // setTimeout(async () => {
    //   await this._closeLightBox()
    // }, 15000)
  }

  async _launchBrowser() {
    this.customOptions = global.appConfig.puppeteer || {}
    this.browser = await puppeteer.launch({
      headless: appConfig.debug != true,
      executablePath: '/usr/bin/google-chrome',
      ...this.customOptions,
    })
  }

  async _gotoAirBoxPage() {
    this.page = await this.browser.newPage()
    this.page.goto(this.url)
  }

  async  _closeLightBox() {
    const lightBoxCloseButton = '.bootbox-close-button'


    try {
      await this.page.waitForSelector(lightBoxCloseButton, { timeout: 10000 })
    } catch(error) {
      log(await this.page.content())
      console.log(error)
      log('找不到lightbox', 'red')
      return
    }

    return
    try {
      await this.page.click(lightBoxCloseButton)
    } catch(error) {
      log(JSON.stringify(error), 'red')
    }
  }
}

export default new GetAirBoxSnapSnapshot()