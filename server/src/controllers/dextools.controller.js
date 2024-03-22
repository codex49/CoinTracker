import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';
import fetch from 'node-fetch';
import Twitter  from 'twitter';
import { connectDB } from '../config/config.js';
import { SolanaModel, EtherModel, BscModel } from '../models/model.js';
import { saveCheckedPairs, isPairExists, uncheckedPairs } from '../utils/utils.js';
import Store from '../services/store.js';

dotenv.config();
connectDB();
const wss = new WebSocketServer({ port: 8080 });
const storeInstance = new Store(process.env.MONGO_STRING);
const pair_list_hash = {}

const bearerToken = 'AAAAAAAAAAAAAAAAAAAAAGA9rgEAAAAAKvjIDxf7mw19gaUlEdDJC41DnLU%3Dzj0v7CxEfyp5625UNzueBqmLq6tVAU2WR6rFHr0C5LrgNNeZvs'; // Replace with your actual Bearer Token

async function getTwitterFollowerCount(username) {
    const url = `https://api.twitter.com/2/users/by/username/${username}?user.fields=public_metrics`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${bearerToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.data.public_metrics.followers_count;
    } catch (error) {
        console.error('Error fetching follower count:', error);
        return null;
    }
}
export const scrapeDextools = async (req, res) => {
    // const screenName = 'veloprotocol'; // Replace with the target username

    // getTwitterFollowerCount(screenName).then(followers => {
    //     console.log(`Followers of veloprotocol: ${followers}`);
    // }).catch(error => {
    //     console.error(error);
    // });

    wss.on('connection', (ws) => {

        console.log('Client connected');
        ws.send(JSON.stringify(process.env.CHAINS.split(',').map(chain => chain.trim())));
    
        ws.on('message', async (msg) => {
            const resp = JSON.parse(msg);
            if (!resp.pairData && resp.data?.event === 'create') {
                const url = `https://www.dextools.io/shared/data/pair?address=${resp.data.id}&chain=solana&audit=true&locks=true`;
                ws.send(JSON.stringify({ url, chain: resp.chain }));
            }
            else if (!resp.pairData && resp.data?.event === 'pair_lists') {
                const pairIds = resp.data.pair_lists.map((pair => pair.id));
                pair_list_hash[resp.chain] = await uncheckedPairs(resp.chain, pairIds);
    
                if (pair_list_hash[resp.chain] && pair_list_hash[resp.chain].length > 0) {
                    const pairid = pair_list_hash[resp.chain].pop();
                    const url = `https://www.dextools.io/shared/data/pair?address=${pairid}&chain=solana&audit=true&locks=true`;
                    ws.send(JSON.stringify({ url, chain: resp.chain }));
                    console.log("Pair Left: ", pair_list_hash[resp.chain].length);
                } else {
                    console.log("Empty!");
                }
            }
            else if (resp.pairData) {
                const holders = resp.data.token.metrics.holders;
                const market_cap = resp.data.token.metrics.mcap;

                if (
                    resp.data?.token?.links?.website && 
                    resp.data?.token?.links?.twitter && 
                    holders > 300 &&
                    (market_cap == null || market_cap > 100000) ) {
                    const pairID = resp.data.id.pair;
                    const pairData = {
                        name: resp.data.name,
                        pair: resp.data.symbol + '/' + resp.data.symbolRef,
                        market_cap: market_cap,
                        liquidity: resp.data.metrics.liquidity,
                        holders: resp.data.token.metrics.holders,
                        total_market_cap: resp.data.token.metrics.mcap,
                        volume_24h: resp.data.price24h?.volume,
                        total_supply: resp.data.token.metrics.totalSupply,
                        website: resp.data.token.links.website,
                        twitter: resp.data.token.links.twitter,
                        telegram: resp.data.token.links.telegram,
                        discord: resp.data.token.links.discord,
                        chain: resp.data.id.chain,
                        url: resp.data.id.token
                    }
                    const isExsits = await isPairExists(resp.chain, pairID);
                    if (!isExsits) {
                        if (resp.chain === 'solana') {
                            const savedPair = await SolanaModel.create(pairData);
                            // console.log(savedPair);
                        } else if (resp.chain === 'ether') {
                            const savedPair = await EtherModel.create(pairData);
                            console.log(savedPair);
                        } else if (resp.chain === 'bnb') {
                            const savedPair = await BscModel.create(pairData);
                            console.log(savedPair);
                        }
                    }
                }
    
                await saveCheckedPairs(resp.chain, resp.data.id.pair);
    
                if (resp.listScraper && pair_list_hash[resp.chain] && pair_list_hash[resp.chain].length > 0) {
                    const pairid = pair_list_hash[resp.chain].pop();
                    const url = `https://www.dextools.io/shared/data/pair?address=${pairid}&chain=solana&audit=true&locks=true`;
                    ws.send(JSON.stringify({ url, chain: resp.chain }));
                    console.log("Pair Left: ", pair_list_hash[resp.chain].length)
                }
            }
        });
    });
  };

export const getDextoolsCoins = async (req, res) => {
    try {
    const coins = await storeInstance.getDextoolsCoins();
    res.status(200).json(coins);
    } catch (error) {
    console.error('Error in getPumpedCoins method:', error);
    res.status(500).send(error.message);
    }
};

export const clearDextoolsCoins = async (req, res) => {
    try {
        await storeInstance.clearDextoolsCoins();
    } catch (error) {
      console.error('Error in getPumpedCoins method:', error);
      res.status(500).send(error.message);
    }
};