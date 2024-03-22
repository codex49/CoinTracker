import express from 'express';
import { scrapeDextools,  getDextoolsCoins, clearDextoolsCoins} from '../controllers/dextools.controller.js';
import { fetchRaydium } from '../controllers/solana.controller.js';


const router = express.Router();
router.get('/dextools', scrapeDextools);
router.get('/getDextoolsCoins', getDextoolsCoins);
router.get('/clearDextoolsCoins', clearDextoolsCoins);
router.get('/raydium', fetchRaydium);


export default router;
