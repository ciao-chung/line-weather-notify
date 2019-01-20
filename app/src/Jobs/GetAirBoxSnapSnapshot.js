import puppeteer from 'puppeteer'
import uuid from 'uuid/v4'
import moment from "moment/moment"
import LineNotify from 'Libs/LineNotify'
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
    try {
      await this._gotoAirBoxPage()
      await this._closeLightBox()
    } catch(error) {
      log(error, 'yellow')
      log('空氣盒子導向失敗, 已略過空氣盒子截圖服務', 'yellow')
      return
    }
    for(const item of appConfig.airbox.screenshot) {
      await this._takeScreenshot(item)
    }

    await this._closeBrowser()
    await this._sendPhotos()
  }

  _getComputedTime(time) {
    return moment(time).format('YYYY/MM/DD HH:mm')
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
      timeout: 10000,
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

  async _takeScreenshot(item) {
    if(Array.isArray(item.actions)) {
      for(const action of item.actions) {
        if(action == '+' || action == '-') {
          await this._zoom(action)
          continue
        }

        if(action == 'reload') {
          await this._reload()
          continue
        }

        if(Array.isArray(action)) {
          await this._mouseDrag(action[0], action[1])
          continue
        }
      }
    }

    const screenshotFilePath = pathResolve(appConfig.puppeteer.screenShotStorePath, `line-weather-notify-screenshot-${uuid()}.png`)
    this.screenShotPhotos.push({
      title: `\n${this._getComputedTime(now())} ${item.location}空氣品質`,
      path: screenshotFilePath,
    })

    await this.page.screenshot({
      path: screenshotFilePath,
      fullPage: true,
    })

    log(`截圖成功(${item.location}): ${screenshotFilePath}`)
    await this.page.waitFor(500)
  }

  async _reload() {
    await this.page.reload({
      waitUntil: 'networkidle0',
    })

    await this._closeLightBox()
  }

  async _closeBrowser() {
    await this.page.close()
    await this.browser.close()
    log('關閉瀏覽器', 'yellow')
  }

  async _mouseDrag(x, y) {
    const target = await this.page.$('body')
    const body = await target.boundingBox()
    const mouse = this.page.mouse
    await mouse.move(body.x+body.width/2, body.y+body.height/2)
    await mouse.down()
    await mouse.move(x, y, {
      steps: 20
    })
    await mouse.up()
    await this.page.waitFor(500)
  }

  async _zoom(type = '+') {
    const label = type == '-' ? '縮小' : '放大'
    const zoomInSelector = `button[aria-label="${label}"]`
    await this.page.evaluate(zoomInSelector => { document.querySelector(zoomInSelector).click() }, zoomInSelector)
    await this.page.waitFor(500)
  }

  async _sendPhotos() {
    for(const photo of this.screenShotPhotos) {
      log(`發送圖片: ${photo.path}\n`)
      await LineNotify.send(photo.title, photo.path)
      await execAsync(`rm -rf ${photo.path}`)
    }
  }
}

export default new GetAirBoxSnapSnapshot()