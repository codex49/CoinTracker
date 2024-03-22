import express from 'express';
import { startProcessing, getPumpedCoins, removeKucoinPumpedCoins } from '../controllers/pumpExchange.controller.js';


const router = express.Router();
router.get('/watch/:exchangeName/:ratio', startProcessing);
router.get('/pumpedCoins/:exchangeName', getPumpedCoins);
router.delete('/removePumpedCoins/:exchangeName', removeKucoinPumpedCoins);


export default router;
