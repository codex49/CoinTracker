import  { Connection, PublicKey } from '@solana/web3.js';
import  WebSocket from 'ws';

const RAYDIUM_PUBLIC_KEY = "675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8";

const SESSION_HASH = 'QNDEMO' + Math.ceil(Math.random() * 1e9); // Random unique identifier for your session
let credits = 0;

const raydium = new PublicKey(RAYDIUM_PUBLIC_KEY);
const mintAddress = new PublicKey("4CJtTV5ZB5xtqWrrW68xkRsJdE7JyabQBZCrC3m2a2UH");
// Replace HTTP_URL & WSS_URL with QuickNode HTTPS and WSS Solana Mainnet endpoint
const connection = new Connection(`https://ultra-cold-sea.solana-mainnet.quiknode.pro/84fe7155a001bd60d7d9989162030818eb9775c1/`, {
    wsEndpoint: `wss://ultra-cold-sea.solana-mainnet.quiknode.pro/84fe7155a001bd60d7d9989162030818eb9775c1/`,
    httpHeaders: {"x-session-hash": SESSION_HASH}
});



// Monitor logs
async function main(connection, programAddress) {
    console.log("Monitoring logs for program:", programAddress.toString());
    connection.onLogs(
        programAddress,
        ({ logs, err, signature }) => {
            if (err) return;

            if (logs && logs.some(log => log.includes("initialize2"))) {
                console.log("Signature for 'initialize2':", signature);
                fetchRaydiumAccounts(signature, connection);
            }
        },
        "finalized"
    );
}

// Parse transaction and filter data
async function fetchRaydiumAccounts(txId, connection) {
    const tx = await connection.getParsedTransaction(
        txId,
        {
            maxSupportedTransactionVersion: 0,
            commitment: 'confirmed'
        });

    
    credits += 100;
    
    const accounts = tx?.transaction.message.instructions.find(ix => ix.programId.toBase58() === RAYDIUM_PUBLIC_KEY).accounts;
    if (!accounts) {
        console.log("No accounts found in the transaction.");
        return;
    }

    //console.log(JSON.stringify(tx, null, 2));

    const tokenAIndex = 8;
    const tokenBIndex = 9;

    const tokenAAccount = accounts[tokenAIndex];
    const tokenBAccount = accounts[tokenBIndex];

  try {
    const accountInfo = await connection.getAccountInfo(tokenAAccount.toBase58());
    console.log('getAccountInfo------------------------------', accountInfo);
    } catch (error) {
        console.error('Failed to fetch account info:', error);
    }

    const displayData = [
        { "Token": "A", "tokenA": tokenAAccount.toBase58() },
        { "Token": "B", "tokenB": tokenBAccount.toBase58() }
    ];

    console.log("New LP Found");
    console.log(generateExplorerUrl(txId));
    console.table(displayData);
    console.log("Total QuickNode Credits Used in this session:", credits);

    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(tokenAAccount.toBase58()));
        }
    })
}

function generateExplorerUrl(txId) {
    return `https://solscan.io/tx/${txId}`;
}

export const fetchRaydium = () => {
    return main(connection, raydium).catch(console.error);
}

const wss = new WebSocket.Server({ port: 8081 });

wss.on('connection', function connection(ws) {
  console.log('A new client connected');

  ws.on('message', function incoming(message) {
    console.log('received: %s', message, tokenAAccount);
  });
});

async function fetchMetadata(connection, mintAddress) {
    // Assuming `findMetadataAccount` is the method to find the metadata account for a mint
    const [metadataAccount] = await Metadata.findMetadataAccount(mintAddress);
    const metadata = await Metadata.load(connection, metadataAccount);
    return metadata.data;
}
// Usage
//const connection = new Connection("https://api.mainnet-beta.solana.com/");


