import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

//import usersRouter from './src/routes/user.routes.js';
//import coinsRouter from './src/routes/coin.routes.js';
//import twitterRouter from './src/routes/twitter.routes.js';
import pumpRouter from './src/routes/pumb.routes.js';
import newCoins from './src/routes/newCoins.routes.js';

dotenv.config();
const app = express();

// Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Could not connect to MongoDB', err));

app.use(cors());
app.use(express.json());

// Define routes
// app.use('/api/users', usersRouter);
//app.use('/api/coins', coinsRouter);
//app.use('/api/twitter', twitterRouter);

app.use('/api/pump', pumpRouter);
app.use('/api/newCoins', newCoins);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
