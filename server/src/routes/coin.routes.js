import axios from 'axios';
import https from 'https';
import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.dextools.io/pairs/BTCBNB/trades', {
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching coin data');
  }
});

export default router;
