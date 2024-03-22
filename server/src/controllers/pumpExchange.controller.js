import death from 'death';
import Kucoin from '../services/kucoin.js';
import Binance from '../services/binance.js';
import MEXC from '../services/mexc.js';
import Time from '../utils/time.js';
import Store from '../services/store.js';
import Broker from '../services/broker.js';
import Coinmarketcap from '../services/coinmarketcap.js';
import dotenv from 'dotenv';
dotenv.config();

const timeInRange = [1, 2];
//const ratio = 1;
const storeInstance = new Store(process.env.MONGO_STRING);
const exchangeInstances = {
  kucoin: new Kucoin(process.env.KUCOIN_API_KEY, process.env.KUCOIN_API_SECRET),
  binance: new Binance(process.env.BINANCE_API_KEY, process.env.BINANCE_API_SECRET),
  mexc: new MEXC(process.env.MEXC_API_KEY, process.env.MEXC_API_SECRET),
};

const lastProcessedResults = {
  kucoin: {},
  binance: {},
};

for (const exchange of Object.values(exchangeInstances)) {
  exchange.setStore(storeInstance);
}

async function processExchange(exchangeName, ratio) {
  let startTime = Time.getCurrentTimestamp();
  const exchange = exchangeInstances[exchangeName];

  const processor = async () => {
    let rateValues = [];
    for (const minute of timeInRange) {
      let tsByMinute = Time.getTimestampByMinute(startTime, minute);
      let data = await storeInstance.getPairsByTimeStamp(exchangeName, tsByMinute);
      rateValues[minute] = await Broker.processPairs(data);
      if (minute === timeInRange[timeInRange.length - 1]) {
        let result = await Broker.processByRatio(ratio, rateValues);
        if (Object.keys(result).length > 0) {
          const resultString = JSON.stringify(result);
          if (!lastProcessedResults[exchangeName][resultString]) {
            await logPumpedCoins(exchangeName, result);
            lastProcessedResults[exchangeName][resultString] = true;
          }
        }
        await storeInstance.reset(exchangeName);
        startTime = Time.getCurrentTimestamp();
        await processor();
      }
    }
  };

  await exchange.runListener(await exchange.pairs());
  await processor();
}

async function logPumpedCoins(exchangeName, result) {
  for (const pair in result) {
    const symbol = pair.split('-')[0];
    const cryptoName = Coinmarketcap.getCryptoName(symbol);

    const coinPump = {
      exchange: exchangeName,
      coin: pair,
      name: cryptoName.replace(' ', '-'),
      timestamp: Time.getCurrentISO()
    };

    result[pair].forEach(item => {
      coinPump[item.range] = item.value;
    });

    if (timeInRange.length === result[pair].length) {
      await storeInstance.logPumpedCoin(coinPump);
    }   
  }
}

export const startProcessing = async (req, res) => {
  const { exchangeName, ratio } = req.params;
  if (!exchangeInstances[exchangeName]) {
    return res.status(400).send('Unsupported exchange type');
  }
  try {
    await processExchange(exchangeName, ratio);
    res.status(200).send(`Processing started for ${exchangeName}`);
  } catch (error) {
    console.error('error', error);
    res.status(500).send(error.message);
  }

  death(() => {
    storeInstance.reset(exchangeName);
    process.exit(99);
  });
};

export const getPumpedCoins = async (req, res) => {
  const { exchangeName } = req.params;
  try {
    const coins = await storeInstance.getPumpedCoins(exchangeName);
    res.status(200).json(coins);
  } catch (error) {
    console.error('Error in getPumpedCoins method:', error);
    res.status(500).send(error.message);
  }
};

export const removeKucoinPumpedCoins = async (req, res) => {
  const { exchangeName } = req.params;
  try {
    await storeInstance.removePumpedCoins(exchangeName);
    res.status(200).send('Kucoin pumped coins removed');
  } catch (error) {
    console.error('Error removing Kucoin pumped coins:', error);
    res.status(500).send(error.message);
  }
};
