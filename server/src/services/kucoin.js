import Time from '../utils/time.js';
import CoinMarketCap from '../services/coinmarketcap.js';
import api from 'kucoin-node-api';
import WebSocket from 'ws';
import axios from 'axios';

const PAIR_SUFFIX = 'USDT';
const BATCH_SIZE = 100;
const EXCLUDED_PATTERNS = ['UP', 'DOWN', '3L', '3S', '2S'];
const KUCOIN_API_URL = 'https://api.kucoin.com/api/v1/bullet-public';

export default class KuCoin {
  constructor(key, secret) {
    api.init({
      key: key,
      secretKey: secret,
      passphrase: 'ahmed123',
      environment: 'live'
    });
    this.cache = {};
    this.socket = null;
  }

  setStore(store) {
    this.store = store;
  }

  async pairs() {
    const currentTimestamp = Time.getCurrentTimestamp();
    if (this.cache[currentTimestamp]) {
      return Object.keys(this.cache[currentTimestamp]);
    }
  
    try {
      const response = await api.getAllTickers();
      this.cache[currentTimestamp] = await this.filterPairs(response.data.ticker || []);
      return Object.keys(this.cache[currentTimestamp]);
    } catch (error) {
      console.error('Error fetching pairs:', error);
      return [];
    }
  }

  async filterPairs(pairs) {
    const marketCaps = await CoinMarketCap.fetchMarketCaps(pairs.map(pair => pair.symbol));
    return pairs.reduce((result, pair) => {
      const isExcluded = EXCLUDED_PATTERNS.some(pattern => pair.symbol.includes(pattern + '-'));
      const symbol = pair.symbol.replace(PAIR_SUFFIX, '').replace('-', '');
      if (!isExcluded && pair.symbol.endsWith(PAIR_SUFFIX) && marketCaps[symbol] && marketCaps[symbol].volume_24h < 100000) {
        result[pair.symbol] = pair.high;
      }
      return result;
    }, {});
  }
  
  async getToken() {
    try {
      const response = await axios.post(KUCOIN_API_URL, {});
      return response.data?.data?.token ?? null;
    } catch (error) {
      console.error('Error fetching WebSocket token:', error);
      return null;
    }
  }

  async runListener(pairSymbols) {
    const token = await this.getToken();
    if (!token) {
      console.error('Failed to get valid token');
      return;
    }

    this.initializeWebSocket(token, pairSymbols);
  }

  initializeWebSocket(token, pairSymbols) {
    this.socket = new WebSocket(`wss://ws-api-spot.kucoin.com/?token=${token}`);
    this.socket.onopen = () => this.subscribeToPairs(pairSymbols);
    this.socket.onmessage = this.handleWebSocketMessage;
    this.socket.onclose = () => this.handleWebSocketClose(pairSymbols);
    this.socket.onerror = (error) => console.error('WebSocket Error:', error);
  }

  subscribeToPairs(pairSymbols) {
    for (let i = 0; i < pairSymbols.length; i += BATCH_SIZE) {
      const batchSymbols = pairSymbols.slice(i, i + BATCH_SIZE).join(',');
      const message = {
        id: Date.now(),
        type: "subscribe",
        topic: `/market/ticker:${batchSymbols}`,
        privateChannel: false,
        response: true
      };
      this.socket.send(JSON.stringify(message));
    }
  }

  handleWebSocketMessage = (event) => {
    const data = JSON.parse(event.data);
    if (data?.type === 'message' && data?.data?.price) {
      this.store.logPairs('kucoin', {
        'pair': data.topic.split(':')[1],
        'value': data.data.price,
        'timestamp': Time.getCurrentTimestamp()
      });
    }
  }

  handleWebSocketClose = (pairSymbols) => {
    console.log('WebSocket connection closed. Attempting to reconnect...');
    setTimeout(() => this.runListener(pairSymbols), 2000);
  }
}
