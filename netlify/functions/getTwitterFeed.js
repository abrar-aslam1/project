const axios = require('axios');

exports.handler = async (event, context) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    // Parse the request body
    const body = JSON.parse(event.body);
    const account = body.accounts_input;

    // If no specific account is provided, use a random one
    const accounts = [
      '@CryptoWizardd', '@Crypto_Jopp', '@TheCryptoKazi', '@AltcoinSensei',
      '@AltcoinMiyagi', '@rare10x', '@CryptoTony__', '@CryptoShilllz',
      '@alanrog3', '@ChadCaff', '@fitforcrypto_', '@luxe_spoon'
    ];
    
    const selectedAccount = account || accounts[Math.floor(Math.random() * accounts.length)];
    console.log('Selected account:', selectedAccount);

    // Make request to the agent.ai API
    const response = await axios({
      method: 'POST',
      url: 'https://api-lr.agent.ai/v1/agent/vqe8j2qer4ci8o0u/webhook/33c0ca2e',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        accounts_input: selectedAccount
      }
    });

    // Extract tweets from the response
    const tweets = response.data.response.response;
    console.log(`Received ${tweets.length} tweets`);

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
        link: `https://twitter.com/${selectedAccount.replace('@', '')}/status/${tweet.id}`,
        icon: null,
        category: 'social',
        subCategory: selectedAccount,
        publishedAt: tweet.created_at,
        isFavorite: false,
        type: 'tweet',
        metrics: tweet.public_metrics
      }));

    console.log(`Transformed ${transformedTweets.length} tweets (excluding replies and retweets)`);

    // Return the transformed tweets
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(transformedTweets)
    };

  } catch (error) {
    console.error('Error in Twitter handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message
      }),
    };
  }
};
