import axios from 'axios'
class BaseCwbLibs {
  async fetchCwbData(dataset, params = {}) {
    const apiToken = global.appConfig.cwb.token
    let url = `/${dataset}?Authorization=${apiToken}&format=JSON`
    for(const key in params) {
      const value = params[key]
      url += `&${key}=${value}`
    }

    let requestConfig = {
      baseURL: 'https://opendata.cwb.gov.tw/api/v1/rest/datastore',
      url: encodeURI(url),
      method: 'get',
      responseType: 'json',
    }

    return await axios(requestConfig)
  }
}

export default BaseCwbLibs