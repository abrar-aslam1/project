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

    // Default to CryptoWizardd if no account specified
    const accountToFetch = accounts_input || '@CryptoWizardd';

    try {
      // Make request to the agent.ai API
      const response = await axios({
        method: 'POST',
        url: 'https://api-lr.agent.ai/v1/agent/vqe8j2qer4ci8o0u/webhook/33c0ca2e',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          accounts_input: accountToFetch
        }
      });

      // Extract tweets from the response
      const tweets = response.data.response.response;

      if (!Array.isArray(tweets)) {
        console.error('Invalid response format:', tweets);
        throw new Error('Invalid response format from Twitter API');
      }

      // Filter out replies and retweets, then transform the tweets
      const transformedTweets = tweets
        .filter(tweet => {
          if (!tweet || !tweet.text) return false;
          const text = tweet.text.trim();
          return !text.startsWith('@') && !text.startsWith('RT @'); // Filter out replies and retweets
        })
        .map(tweet => ({
          id: tweet.id,
          title: tweet.text.split('\n')[0] || tweet.text,
          description: tweet.text,
          source: accountToFetch,
          link: `https://twitter.com/${accountToFetch.replace('@', '')}/status/${tweet.id}`,
          icon: null,
          category: 'social',
          subCategory: accountToFetch,
          publishedAt: tweet.created_at,
          isFavorite: false,
          type: 'tweet',
          metrics: tweet.public_metrics || {
            like_count: 0,
            retweet_count: 0,
            reply_count: 0,
            bookmark_count: 0
          }
        }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(transformedTweets)
      };
    } catch (apiError) {
      console.error('API request failed:', apiError);
      // Return empty array instead of error to prevent UI disruption
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify([])
      };
    }
  } catch (error) {
    console.error('Error in Twitter handler:', error);
    // Return empty array instead of error to prevent UI disruption
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify([])
    };
  }
};
