const axios = require('axios');
const express = require('express');
const router = express.Router();
const https = require('https');
const { TwitterApi } = require('twitter-api-v2');


const client = new TwitterApi({
  appKey: 'D9SadBK3NhHVnypYuWyCgaUqA',
  appSecret: 'OYtz93Vor83A0XSG9B5CrlLj5PP0wWAh66cmuGWIldHKn7x4Ll',
  accessToken: '1641964456065335297-fJclc8ZjXcFtIcNpONy2S6tLaweegX',
  accessSecret: 'DwTdBsrzjAiJK6G1zTkTfD894CcsPiW0f3deuFgmLL1WH',
});

async function getUserIdByUsername(username) {
    try {
      const user = await client.v2.userByUsername(username);
      return user.data.id;
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
}
async function getTweetsByUserId(userId) {
    try {
      const tweets = await client.v2.userTimeline(userId, { max_results: 5 });
      return tweets.data;
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  }
router.get('/', async (req, res) => {
    getUserIdByUsername('veloprotocol').then(userId => {
        if (userId) {
          getTweetsByUserId(userId).then(tweets => {
            console.log('Tweets:', tweets);
          });
        }
      });
});

module.exports = router;
