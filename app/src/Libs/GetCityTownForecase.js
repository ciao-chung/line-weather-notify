import BaseCwbLibs from 'Libs/BaseCwbLibs'
class GetCityTownForecase extends BaseCwbLibs{
  async fetch(dataset, townsArray) {
    // 組氣象局API要用的鄉鎮字串
    let towns = ''
    for(const index in townsArray) {
      const town = townsArray[index]
      if(index == 0) towns = town
      else towns += `,${town}`
    }

    // 抓氣象局資料
    let city
    try {
      const responseData = await this.fetchCwbData(dataset, {
        locationName: towns,
        elementName: 'Wx,AT,WeatherDescription,PoP6h,PoP12h',
      })

      city = responseData.data.records.locations[0]
    } catch(error) {
      log(error.response.data, 'red')
      return null
    }

    // 讓鄉鎮的訊息排序可以跟JSON設定檔中的一樣
    let reOrderLocations = []
    for(const town of townsArray) {
      const location = city.location.find(location => location.locationName == town)
      if(!location) continue
      reOrderLocations.push(location)
    }
    city.location = reOrderLocations

    // 把氣象局的資料再整理過一次
    let locations = city.location.map(location => {
      let newElements = {}
      for(const element of location.weatherElement) {
        newElements[element.elementName] = element
      }

      location.weatherElement = newElements
      return location
    })

    return {
      city: city.locationsName,
      towns: locations,
    }
  }
}

export default new GetCityTownForecase()