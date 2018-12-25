import GetCityTownForecase from 'Libs/GetCityTownForecase'
import moment from 'moment'
import LineNotify from 'Libs/LineNotify'
class GetCwbData {
  async start() {
    if(!Array.isArray(appConfig.cwb.city)) return

    for(const city of appConfig.cwb.city) {
      await this._sendCityTown3DaysForecast(city.dataset, city.towns, city.data)
    }
  }

  _getComputedTime(time) {
    return moment(time).format('YYYY/MM/DD HH:mm')
  }

  async _sendCityTown3DaysForecast(dataset, townsArray, dataConfig = null) {
    const data = await GetCityTownForecase.fetch(dataset, townsArray)
    let message = ''
    for(const town of data.towns) {
      message += await this._getSingleTownForecaseMessage(data.city, town, dataConfig)
    }
    await LineNotify.send(message)
  }

  /**
   * 取得單一鄉鎮的氣象訊息
   * @param data {object} 從氣象局取得的鄉鎮氣象資料
   * @param dataConfig {object|null} 設定要顯示的氣象資料
   * @returns {Promise<string>}
   * @private
   */
  async _getSingleTownForecaseMessage(city, data, dataConfig = null) {
    if(!dataConfig) dataConfig = {
      // 天氣現象
      Wx: true,

      // 天氣預報綜合描述
      WeatherDescription: true,

      // 體感溫度
      AT: true,

      // 6小時降雨機率
      PoP6h: true,

      // 12小時降雨機率
      PoP12h: true,
    }
    let result = `\n\n[ ${city} - ${data.locationName} ]\n`

    // 天氣現象
    if(dataConfig.Wx) {
      result += this._getWeatherElementData(data.weatherElement.Wx, 2)
    }


    // 天氣預報綜合描述
    if(dataConfig.WeatherDescription) {
      result += this._getWeatherElementData(data.weatherElement.WeatherDescription, 2)
    }

    // 體感溫度
    if(dataConfig.AT) {
      result += this._getWeatherElementData(data.weatherElement.AT, 2, {
        createMessage: dataItem => {
          let message = `${this._getComputedTime(dataItem.dataTime)}： `
          message += `${dataItem.elementValue[0].value} 度\n`
          message += `\n`
          return message
        }
      })
    }

    // 6小時降雨機率
    if(dataConfig.PoP6h) {
      result += this._getWeatherElementData(data.weatherElement.PoP6h, 2, { unit: '%' })
    }

    // 12小時降雨機率
    if(dataConfig.PoP12h) {
      result += this._getWeatherElementData(data.weatherElement.PoP12h, 2, { unit: '%' })
    }
    return result
  }

  /**
   * 取得Weather Element的資料訊息
   * @param data {string} Weather Element
   * @param limit {number} 資料限制數量
   * @returns {string}
   * @private
   */
  _getWeatherElementData(data, limit = 0, options = {}) {
    let result = `${data.description}\n`
    for(const index in data.time) {
      const dataItem = data.time[index]

      if(limit > 0) {
        if(parseInt(index)+1 > limit) return result
      }

      try {
        // 自訂訊息內容
        if(typeof options.createMessage == 'function') {
          result += options.createMessage(dataItem)
          continue
        }

        const unit = !options.unit ? '' : options.unit
        result += `${this._getComputedTime(dataItem.startTime)} - ${this._getComputedTime(dataItem.endTime)}： `
        result += `${dataItem.elementValue[0].value}${unit}\n`
        result += `\n`
      } catch(error) {
        continue
      }
    }

    return result
  }
}

export default new GetCwbData()