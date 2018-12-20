import axios from 'axios'
class LineNotify{
  constructor() {
    this.token = appConfig.lineNotify.token
  }

  async send(params) {
    try {
      await axios({
        url: 'https://notify-api.line.me/api/notify',
        method: 'post',
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params,
      })
      log('[Notify] Send line notify successfully', 'green')
    } catch(error) {
      const response = error.response
      log(`[Notify] Line notify error ${response.status}`, 'red')
      log(`${response.data}`, 'red')
    }
  }
}

export default () => new LineNotify()