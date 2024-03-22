import BinanceNode from 'binance-api-node'
import Time from '../utils/time.js'

export default class Binance {
  constructor (key, secret) {
    this.instance = BinanceNode.default({
      apiKey: key,
      apiSecret: secret,
    })

    this.cache = {}
  }

  setStore (store) {
    this.store = store
  }

  async pairs () {
    if (this.cache[Time.getCurrentTimestamp()]) {
      return this.cache[Time.getCurrentTimestamp()]
    }

    let pairs = await this.instance.prices()
    let result = {}

    Object.keys(pairs).forEach(key => {
      if (key.slice(-4) === 'USDT') {
        result[key] = pairs[key]
      }
    })

    this.cache[Time.getCurrentTimestamp()] = result

    return Object.keys(result)
  }


  async runListener (pairs) {
    let self = this

    return await this.instance.ws.candles(pairs, '1m', symbol => {
      this.store.logPairs('binance', {
        'pair': symbol.symbol,
        'value': symbol.close,
        'timestamp': Time.getCurrentTimestamp()
      })
    });
  }

}
