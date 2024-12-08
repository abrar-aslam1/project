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
    console.log('Attempting to fetch crypto news...');
    const apiKey = process.env.RAPIDAPI_KEY || process.env.VITE_RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST || process.env.VITE_RAPIDAPI_HOST;

    if (!apiKey || !apiHost) {
      console.error('Missing API credentials:', { apiKey: !!apiKey, apiHost: !!apiHost });
      throw new Error('Missing API credentials');
    }

    const options = {
      method: 'GET',
      url: 'https://crypto-news16.p.rapidapi.com/news/top/5',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
      }
    };

    const response = await axios.request(options);
    console.log('Successfully fetched news data');
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error in cryptoNews function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch crypto news', 
        details: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};
