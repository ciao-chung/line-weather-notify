import puppeteer from 'puppeteer'
class GetAirBoxSnapSnapshot {
  constructor() {
    this.screenShotPhotos = []
    this.url = 'https://airbox.edimaxcloud.com'
    this.baseViewPort = {
      width: 1600,
      height: 1200,
    }
  }
  async start() {
    await this._launchBrowser()
    await this._gotoAirBoxPage()
    await this._closeLightBox()
    await this._takeFullPageScreenshot()
    await this._takeTaichungScreenshot()
    await this.page.waitFor(1000)
    await this._closeBrowser()
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
    await this.page.setViewport(this.baseViewPort)
    await this.page.goto(this.url, {
      waitUntil: 'networkidle0',
    })
    await this.page.waitFor(1000)
  }

  async  _closeLightBox() {
    const lightBoxCloseButton = 'div.bootbox>div.modal-dialog>div.modal-content>div.modal-body>button.bootbox-close-button.close'

    try {
      await this.page.evaluate(lightBoxCloseButton => {
        document.querySelector(lightBoxCloseButton).click()
      }, lightBoxCloseButton)
    } catch(error) {
      console.log(error)
      log('找不到lightbox', 'red')
      return
    }

    await this.page.waitFor(1000)
  }


  async _takeFullPageScreenshot() {
    const fullPage = pathResolve(appConfig.puppeteer.screenShotStorePath, `overview-${now()}.png`)
    this.screenShotPhotos.push(fullPage)
    await this.page.screenshot({
      path: fullPage,
    })
    log(`截圖成功(整頁): ${fullPage}`)
  }

  async _takeTaichungScreenshot() {
    const photoPath = pathResolve(appConfig.puppeteer.screenShotStorePath, `${now()}.png`)
    this.screenShotPhotos.push(photoPath)
    await this._zoomIn()
    await this._zoomIn()
    await this._zoomIn()
    await this._zoomIn()
    await this.page.mouse.down()
    await this.page.mouse.move(-200, -200)
    await this.page.mouse.up()
    await this.page.screenshot({
      path: photoPath,
    })
    log(`截圖成功(台中): ${photoPath}`)
  }

  async _closeBrowser() {
    await this.page.close()
    await this.browser.close()
    log('關閉瀏覽器', 'yellow')
  }

  async _zoomIn() {
    const zoomInSelector = 'button[aria-label="放大"]'
    await this.page.evaluate(zoomInSelector => { document.querySelector(zoomInSelector).click() }, zoomInSelector)
    await this.page.waitFor(500)
  }
}

export default new GetAirBoxSnapSnapshot()