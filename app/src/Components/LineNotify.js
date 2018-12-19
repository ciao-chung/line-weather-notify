import BaseNotifyDriver from 'Modules/NotifyDrivers/BaseNotifyDriver.js'
class LineNotify extends BaseNotifyDriver{
  async send(title, result) {
    this.token = this.driverConfig.token

    for(const command of result) {
      try {
        await this.axios({
          url: 'https://notify-api.line.me/api/notify',
          method: 'post',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          params: {
            message: this._getContent(title, command),
          }
        })
        log('[Notify] Send line notify successfully', 'green')
      } catch(error) {
        const response = error.response
        log(`[Notify] Line notify error ${response.status}`, 'red')
        log(`${response.data}`, 'red')
      }
    }
  }

  _getContent(title, command) {
    let content = `\n${title} - ${command.description} - ${command.type}\n\n`
    content += `${command.log}`
    return content
  }
}

export default driverConfig => new LineNotify(driverConfig)