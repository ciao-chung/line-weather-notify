import BaseCwbLibs from 'Libs/BaseCwbLibs'
class GetCityTownForecase extends BaseCwbLibs{
  async fetch(dataset, townsArray) {
    let towns = ''
    for(const index in townsArray) {
      const town = townsArray[index]
      if(index == 0) towns = town
      else towns += `,${town}`
    }

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