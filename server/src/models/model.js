import mongoose from 'mongoose';

const chainSchema = new mongoose.Schema({
    name: {
        type: String
    },
    pair: {
        type: String
    },
    market_cap: {
        type: Number
    },
    liquidity: {
        type: Number
    },
    holders: {
        type: Number
    },
    total_market_cap: {
        type: Number
    },
    volume_24h: {
        type: Number
    },
    total_supply: {
        type: Number
    },
    website: {
        type: String,
        default: ''
    },
    twitter: {
        type: String,
        default: ''
    },
    discord: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        default: ''
    },
    chain: {
        type: String,
        default: ''
    }
});

export const SolanaModel = mongoose.model("solana", chainSchema);
export const BscModel = mongoose.model("bsc", chainSchema);
export const EtherModel = mongoose.model("ether", chainSchema);