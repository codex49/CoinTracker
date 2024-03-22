import monk from 'monk';
import Time from '../utils/time.js';
import fs from 'fs/promises';

export default class Store {
  constructor(database) {
    this.instance = monk(database);
  }

  static groupBy(dataArray, prop) {
    return dataArray.reduce((groups, item) => {
      const val = item[prop];
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  }

  logPairs(exchange, data) {
    const collection = `pairs${exchange}`;
    return this.instance.get(collection).insert(data);
  }

  logPumpedCoin(data) {
    return this.instance.get('pumpedCoins').insert(data);
  }

  async getPumpedCoins(exchange) {
    return this.instance.get('pumpedCoins').find({ exchange: exchange });
  }

  async getPairsByTimeStamp(exchange, timestamp) {
    const collection = `pairs${exchange}`;
    while (timestamp > Time.getCurrentTimestamp()) {
      await Time.delay();
    }
    const data = await this.instance.get(collection).find({ timestamp: { '$lt': timestamp } });
    return Store.groupBy(data, 'pair');
  }

  async removePumpedCoins(collectionName) {
    return this.instance.get('pumpedCoins').remove({ exchange: collectionName });
  }

  async reset(exchange) {
    return this.instance.get(`pairs${exchange}`).remove({});
  }

  async getDextoolsCoins() {
    return this.instance.get('solanas').find();
  }

  async clearDextoolsCoins() {
    try {
      await fs.unlink('./solana.log');
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
        console.log('solana.log file does not exist, proceeding with clearing dextools coins.');
    }
    return this.instance.get('solanas').remove({});
  }
}
