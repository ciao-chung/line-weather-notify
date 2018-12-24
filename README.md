# Line氣象通知

> 開發給家人群組用的氣象通知


## 執行

> 只要指定JSON設定檔即可執行

```bash
node prod/line-weather-notify --config=/path/to/config/file
```

## JSON設定檔說明

> 範例可參考meta/config.example.json

```json
{
  // 開啟debug模式, 開啟後puppeteer會關閉chrome的headless模式
  "debug": true,

  "puppeteer": {
    // chrome的執行檔位置
    "executablePath": "/usr/bin/google-chrome",
    
    // 截圖暫存路徑
    "screenShotStorePath": "/foo/bar"
  },
  
  "lineNotify": {
    // Line Notify要通知的對象(可多個)
    "tokens": [
      "token"
    ]
  },
  
  // 氣象局API設定
  "cwb": {
    "token": "token"
  }
}
```



## 功能

- 空氣盒子截圖(全台、台中)

![Demo](https://goo.gl/25kkun)

## 空氣盒子截圖功能簡介

使用[puppeteer](https://github.com/GoogleChrome/puppeteer)開啟空氣盒子

並截取全台、台中的空氣品質截圖

接著透過curl使用[Line Notify API](https://notify-bot.line.me/doc/en/)將截圖發送出去

以下是開啟debug模式中執行截圖的**Demo影片**

可以清楚的看到puppeteer操作chrome的過程

[Demo影片](https://youtu.be/ZzRQTEWbX0c)
