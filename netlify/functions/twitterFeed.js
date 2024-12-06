import axios from 'axios';

export const handler = async function(event, context) {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    let accounts_input;
    
    // Parse the request body if it's a POST request
    if (event.httpMethod === 'POST' && event.body) {
      const body = JSON.parse(event.body);
      accounts_input = body.accounts_input;
    }

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(transformedTweets)
    };
  } catch (error) {
    console.error('Error in Twitter handler:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch Twitter feed',
        details: error.message
      })
    };
  }
};
