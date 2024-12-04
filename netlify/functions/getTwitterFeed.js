const axios = require('axios');

// Cache duration in seconds (15 minutes)
const CACHE_DURATION = 900;

// List of crypto Twitter accounts to track
const CRYPTO_ACCOUNTS = [
  "CryptoWizardd",
  "Crypto_Jopp",
  "TheCryptoKazi",
  "AltcoinSensei",
  "AltcoinMiyagi",
  "rare10x",
  "CryptoTony__",
  "CryptoShilllz",
  "alanrog3",
  "ChadCaff",
  "fitforcrypto_",
  "luxe_spoon"
];

exports.handler = async function(event, context) {
  try {
    console.log('Starting Twitter feed fetch...');
    
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET',
      'Cache-Control': `public, max-age=${CACHE_DURATION}`
    };

    // Fetch tweets from each account
    const allTweets = [];
    
    for (const username of CRYPTO_ACCOUNTS) {
      try {
        console.log(`Fetching tweets for ${username}...`);
        
        // First get user info to get user ID
        const userResponse = await axios.request({
          method: 'GET',
          url: 'https://twitter241.p.rapidapi.com/user',
          params: { username },
          headers: {
            'x-rapidapi-key': process.env.VITE_RAPIDAPI_KEY,
            'x-rapidapi-host': 'twitter241.p.rapidapi.com'
          }
        });

        console.log(`Got user info for ${username}:`, userResponse.data);
        const userId = userResponse.data.id_str;

        // Then get user timeline
        const timelineResponse = await axios.request({
          method: 'GET',
          url: 'https://twitter241.p.rapidapi.com/timeline',
          params: { 
            user_id: userId,
            count: 10 // Get last 10 tweets per account
          },
          headers: {
            'x-rapidapi-key': process.env.VITE_RAPIDAPI_KEY,
            'x-rapidapi-host': 'twitter241.p.rapidapi.com'
          }
        });

        console.log(`Got timeline for ${username}, tweet count:`, timelineResponse.data.length);

        const userTweets = timelineResponse.data.map(tweet => ({
          id: tweet.id_str,
          title: `${userResponse.data.name} (@${username})`,
          description: tweet.full_text || tweet.text,
          content: tweet.full_text || tweet.text,
          source: 'Twitter',
          link: `https://twitter.com/${username}/status/${tweet.id_str}`,
          author: username,
          category: 'crypto',
          subCategory: 'social',
          publishedAt: tweet.created_at,
          type: 'twitter',
          metrics: {
            likes: tweet.favorite_count,
            retweets: tweet.retweet_count
          }
        }));

        allTweets.push(...userTweets);
        console.log(`Added ${userTweets.length} tweets from ${username}`);
      } catch (error) {
        console.error(`Error fetching tweets for ${username}:`, error.response?.data || error.message);
        // Continue with other accounts if one fails
        continue;
      }
    }

    console.log('Total tweets fetched:', allTweets.length);

    // Sort all tweets by date
    allTweets.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(allTweets)
    };
  } catch (error) {
    console.error('Error in Twitter feed function:', error.response?.data || error.message);
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        error: 'Failed to fetch Twitter feed',
        details: error.response?.data || error.message
      })
    };
  }
};
