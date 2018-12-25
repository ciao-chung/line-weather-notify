class LineNotify {
  async send(message, imageFilePath = null) {
    for(const token of appConfig.lineNotify.token) {
      try {
        await this._postNotifyApi(token, message, imageFilePath)
      } catch(error) {
        log(error, 'red')
      }
    }
  }

  async _postNotifyApi(token, message, imageFilePath = null) {
    let curlCommand = `curl -X POST -i https://notify-api.line.me/api/notify `
    curlCommand += `-H "Content-Type: multipart/form-data" `
    curlCommand += `-H "Authorization: Bearer ${token}" `
    curlCommand += `-F "message=${message}" `
    if(imageFilePath) curlCommand += `-F "imageFile=@${imageFilePath}" `
    await execAsync(curlCommand, {}, true)
    await execAsync(`sleep 0.5`)
  }
}

export default new LineNotify()