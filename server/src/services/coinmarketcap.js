import axios from 'axios';

const COINMARKETCAP_QUOTES_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
const COINMARKETCAP_API_KEY = 'e56a32f7-3e8e-45bd-9bde-70ef72af80ae';

class CoinMarketCap {
    cryptoNamesCache = {};

    constructor() {
        this.apiClient = axios.create({
            headers: { 'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY }
        });
    }

    async fetchMarketCaps(pairSymbols) {
        try {
            const symbols = pairSymbols.map(pair => pair.split('-')[0]);
            const uniqueSymbols = [...new Set(symbols)]; // Removing duplicates
            const response = await this.apiClient.get(COINMARKETCAP_QUOTES_API_URL, {
                params: { symbol: uniqueSymbols.join(',') }
            });
            return this.mapMarketCaps(response.data.data);
        } catch (error) {
            console.error('Error fetching market cap data from CoinMarketCap:', error);
            throw error;
        }
    }

    mapMarketCaps(data) {
        let marketCaps = {};
        for (const symbol in data) {
            if (data.hasOwnProperty(symbol)) {
                const currency = data[symbol];
                const volume_24h = currency.quote.USD.volume_24h;
                if (volume_24h < 10000000) {
                    marketCaps[symbol] = { volume_24h };
                    this.cryptoNamesCache[symbol] = currency.name;
                }
            }
        }
        return marketCaps;
    }

    getCryptoName(symbol) {
        return this.cryptoNamesCache[symbol] || 'Unknown';
    }
}

export default new CoinMarketCap();
