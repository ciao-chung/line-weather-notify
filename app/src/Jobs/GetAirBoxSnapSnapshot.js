import puppeteer from 'puppeteer'
import uuid from 'uuid/v4'
class GetAirBoxSnapSnapshot {
  constructor() {
    this.screenShotPhotos = []
    this.url = 'https://airbox.edimaxcloud.com'
    this.baseViewPort = {
      width: 625,
      height: 1000,
    }
  }
  async start() {
    await this._launchBrowser()
    await this._gotoAirBoxPage()
    await this._closeLightBox()
    await this._takeFullPageScreenshot()
    await this._takeTaichungScreenshot()
    await this._closeBrowser()
    await this._sendPhotos()
  }

  async _launchBrowser() {
    this.customOptions = global.appConfig.puppeteer || {}
    log('啟用Puppeteer瀏覽器')
    this.browser = await puppeteer.launch({
      headless: appConfig.debug != true,
      executablePath: '/usr/bin/google-chrome',
      ignoreHTTPSErrors: true,
      ...this.customOptions,
    })
  }

  async _gotoAirBoxPage() {
    this.page = await this.browser.newPage()
    await this.page.setViewport(this.baseViewPort)
    log('導向空氣盒子')
    await this.page.goto(this.url, {
      timeout: 40000,
      waitUntil: 'networkidle0',
    })
    await this.page.waitFor(1000)
  }

  async  _closeLightBox() {
    log('關閉LightBox')
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
    const fullPage = pathResolve(appConfig.puppeteer.screenShotStorePath, `overview-${uuid()}.png`)
    this.screenShotPhotos.push({
      title: `\n${now()}全台空氣品質`,
      path: fullPage,
    })

    await this._mouseDrag(0, -100)

    await this.page.screenshot({
      path: fullPage,
    })
    log(`截圖成功(整頁): ${fullPage}`)
  }

  async _takeTaichungScreenshot() {
    const photoPath = pathResolve(appConfig.puppeteer.screenShotStorePath, `${uuid()}.png`)
    this.screenShotPhotos.push({
      title: `\n${now()}台中空氣品質`,
      path: photoPath,
    })
    await this._zoomIn()
    await this._zoomIn()
    await this._zoomIn()
    await this._mouseDrag(210, 465)

    await this.page.screenshot({
      path: photoPath,
      fullPage: true,
    })
    log(`截圖成功(台中): ${photoPath}`)
  }

  async _closeBrowser() {
    await this.page.close()
    await this.browser.close()
    log('關閉瀏覽器', 'yellow')
  }

  async _mouseDrag(x, y) {
    const innerWidth = await this.page.evaluate(() => window.innerWidth)
    const innerHeight = await this.page.evaluate(() => window.innerHeight)
    const mouse = this.page.mouse
    await mouse.move(innerWidth/2, innerHeight/2)
    await mouse.down()
    await mouse.move(innerWidth/2+x, innerHeight/2+y, {
      steps: 10
    })
    await mouse.up()
    await this.page.waitFor(500)
  }

  async _zoomIn() {
    const zoomInSelector = 'button[aria-label="放大"]'
    await this.page.evaluate(zoomInSelector => { document.querySelector(zoomInSelector).click() }, zoomInSelector)
    await this.page.waitFor(500)
  }

  async _sendPhotos() {
    for(const photo of this.screenShotPhotos) {
      log(`發送圖片: ${photo.path}\n`)
      for(const token of appConfig.lineNotify.token) {
        try {
          await this._sendLineImageNotify(token, photo.title, photo.path)
        } catch(error) {
          log(error, 'red')
        }
      }
      await execAsync(`rm -rf ${photo.path}`)
    }
  }

  async _sendLineImageNotify(token, message, imageFilePath = null) {
    await execAsync(`curl -XPOST -F "message=${message}" -F "imageFile=@${imageFilePath}" -H "Content-Type: multipart/form-data" -H "Authorization: Bearer ${token}" -i https://notify-api.line.me/api/notify`)
    await execAsync(`sleep 1`)
  }
}

export default new GetAirBoxSnapSnapshot()