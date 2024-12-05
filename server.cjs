const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Twitter API endpoint
app.post('/api/twitter', async (req, res) => {
  try {
    const { accounts_input } = req.body;
    console.log('Received request for account:', accounts_input);
    
    // Make request to the agent.ai API
    const response = await axios({
      method: 'POST',
      url: 'https://api-lr.agent.ai/v1/agent/vqe8j2qer4ci8o0u/webhook/33c0ca2e',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        accounts_input: accounts_input || '@CryptoWizardd'
      }
    });

    // Extract tweets from the response
    const tweets = response.data.response.response;
    console.log(`Received ${tweets.length} tweets from API`);

    // Filter out replies and retweets, then transform the tweets
    const transformedTweets = tweets
      .filter(tweet => {
        const text = tweet.text.trim();
        return !text.startsWith('@') && !text.startsWith('RT @'); // Filter out replies and retweets
      })
      .map(tweet => ({
        id: tweet.id,
        title: tweet.text.split('\n')[0] || tweet.text,
        description: tweet.text,
        source: 'Twitter',
        link: `https://twitter.com/${accounts_input?.replace('@', '') || 'CryptoWizardd'}/status/${tweet.id}`,
        icon: null,
        category: 'social',
        subCategory: accounts_input || '@CryptoWizardd',
        publishedAt: tweet.created_at,
        isFavorite: false,
        type: 'tweet',
        metrics: tweet.public_metrics
      }));

    console.log(`Sending ${transformedTweets.length} transformed tweets`);
    res.json(transformedTweets);

  } catch (error) {
    console.error('Error in Twitter handler:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Handle OPTIONS requests for CORS
app.options('/api/twitter', cors());

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
