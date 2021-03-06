# Line氣象通知

> 開發給家人群組用的氣象通知

## Demo影片

[Demo影片](https://youtu.be/MxgJvlcGCiA)

## 安裝

```bash
yarn global add line-weather-notify
```

## 執行

> 只要指定JSON設定檔即可執行

```bash
line-weather-notify --config=/path/to/config/file
```

透過cron tab可以設定成固定時間通知

或是使用我開發的[cron-service](https://github.com/ciao-chung/cron-service)來設定

## JSON設定檔說明

> 範例可參考meta/config.example.json

```json
{
  "debug": true,
  "puppeteer": {
    "executablePath": "/usr/bin/google-chrome",
    "screenShotStorePath": "/foo/bar"
  },
  "lineNotify": {
    "token": [
      "token"
    ]
  },
  "airbox": {
    "screenshot": [
      airboxLocation,
      airboxLocation,
      airboxLocation,
    ]
  },
  "cwb": {
    "city": [
      cityItem,
      cityItem,
      cityItem,
    ],
    "token": "token"
  }
}
```

- debug(optional): Boolean, 開啟debug模式, 開啟後puppeteer會關閉chrome的headless模式, 預設為false
- puppeteer:
  - executablePath(optional): String, puppeteer的chrome的執行檔位置
  - screenShotStorePath(required): String, 截圖暫存路徑
- lineNotify:
  - token(required): Array, Line Notify要通知的對象(可多個)
- airbox:
  - screenshot(Required): Array, airboxLocation陣列, 可以設定airbox中要截圖的區域
- cwb: 中央氣象局API設定
  - city: Array, cityItem陣列, 設定需要做預報的縣市及其鄉鎮
  - token(required): String, API token

**airboxLocation**

```json
{
  "location": "台中",
  "actions": ["+", "+", "+", [210, 470]]
}
```

- location(Required): String, 區域名稱, 此名稱將會顯示在line通知上
- actions(Optional): Array, 操作chrome來控制airbox中的移動/拖曳動作(建議開啟debug模式確認位置), 移動/操作完成後將進行截圖,下列為動作種類說明
  - +: 放大地圖
  - -: 縮小地圖
  - [Number, Number]: 移動地圖(以目前頁面為中心移動), 第一個為x軸, 第二個為y軸



**cityItem**

```json
{
  "title": "台中",
  "dataset": "F-D0047-073",
  "towns": ["太平區", "北屯區"],
  "data": {
    "AT": true,
    "PoP6h": true
  }
}
```

- title(optional): String, 縣市名稱, 單純為了開發方便, 因為只用dataset不容易辨認縣市
- dataset(required): String, 鄉鎮預報的資料集編號, 所有資料集編號請詳見[中央氣象局開放資料平臺之資料擷取API](https://opendata.cwb.gov.tw/dist/opendata-swagger.html)
- towns(required): Array, 要做預報的鄉鎮名稱陣列, 各縣市的鄉鎮名稱請參考[中央氣象局文件](https://opendata.cwb.gov.tw/opendatadoc/CWB_Opendata_API_V1.2.pdf )的**附錄A『全臺縣市鄉鎮對照表』**
- data(optional): Object, 要呈現的氣象資料屬性, 預設為全部呈現, 以下為可用的氣象資料屬性
  - Wx: 天氣現象
  - WeatherDescription: 天氣預報綜合描述
  - AT: 體感溫度
  - PoP6h: 6小時降雨機率 
  - PoP12h: 12小時降雨機率 

## 功能

- 空氣盒子截圖(全台、台中)
- 鄉鎮氣象預報

![Demo](https://goo.gl/25kkun)

## 空氣盒子截圖功能簡介

使用[puppeteer](https://github.com/GoogleChrome/puppeteer)開啟空氣盒子

並截取全台、台中的空氣品質截圖

接著透過curl使用[Line Notify API](https://notify-bot.line.me/doc/en/)將截圖發送出去

以下是開啟debug模式中執行截圖的**Demo影片**

可以清楚的看到puppeteer操作chrome的過程

## 鄉鎮氣象預報

可指定多個鄉鎮

並取得每個鄉鎮的氣象資料再發出Line通知

![Demo](https://goo.gl/d5Xieg)