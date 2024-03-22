// Placeholder for MEXC API library import
import MEXCNode from 'mexc-api-sdk';
import Time from '../utils/time.js';
import WebSocket from 'ws';

export default class MEXC {
  constructor(key, secret) {
    this.instance = new MEXCNode.Spot(key, secret);
    this.wsUrl = 'wss://wbs.mexc.com/ws'; // Replace with the actual MEXC WebSocket URL
    this.ws = null;
    this.cache = {};
  }

  setStore(store) {
    this.store = store;
  }

  async pairs() {
    if (this.cache[Time.getCurrentTimestamp()]) {
      return this.cache[Time.getCurrentTimestamp()];
    }
  
    try {
      const response = await this.instance.exchangeInfo();
  
      if (!response || !Array.isArray(response.symbols)) {
        console.error('Unexpected API response structure:', response);
        return [];
      }
  
      let result = {};
      response.symbols.forEach(symbolInfo => {
        const { symbol } = symbolInfo;
        if (symbol.endsWith('USDT')) {
          result[symbol] = symbolInfo;
        }
      });
  
      this.cache[Time.getCurrentTimestamp()] = result;
      return Object.keys(result);
    } catch (error) {
      console.error('Error fetching pairs from MEXC:', error);
      return [];
    }
  }

  connectWebSocket() {
    this.ws = new WebSocket(this.wsUrl);

    this.ws.on('open', () => {
      console.log('Connected to MEXC WebSocket');
      this.startKeepAlive();
      this.subscribeToPairs(["BTCUSDT", "ETHUSDT"]);
      // You can also subscribe to pairs here if needed
    });

    this.ws.on('message', (data) => {
      // Process incoming data
      const message = JSON.parse(data);
      console.log('Received data:', message);
    });

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    this.ws.on('close', () => {
      console.log('WebSocket connection closed');
      this.stopKeepAlive();
    });
  }

  subscribeToPairs(pairs) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error('WebSocket is not connected.');
      return;
    }
  
    pairs.forEach((pair) => {
        console.log('pair', pair)
      const subscribeMessage = {
        method: "SUBSCRIPTION",
        params: [`spot@public.deals.v3.api@${pair}`]
      };
      this.ws.send(JSON.stringify(subscribeMessage));
    });
  }

  keepAlive() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ method: "PING" }));
    }
  }
  
  startKeepAlive() {
    this.keepAliveInterval = setInterval(() => this.keepAlive(), 10000); // Send PING every 10 seconds
  }
  
  stopKeepAlive() {
    clearInterval(this.keepAliveInterval);
  }  
  
  async runListener(pairs) {
    // Implement the logic to listen for real-time updates
    // This might involve setting up a WebSocket connection with MEXC
    // return await this.instance.ws.subscribeToPairs(pairs, '1m', data => {
    //   this.store.logPairs('mexc', {
    //     'pair': data.symbol,
    //     'value': data.close,
    //     'timestamp': Time.getCurrentTimestamp()
    //   });
    // });

    this.connectWebSocket();
    // Assuming the WebSocket connection is established and ready
    console.log('pairs', pairs)
    this.subscribeToPairs(pairs);
  }
}
