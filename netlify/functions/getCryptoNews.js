const axios = require('axios');

// Cache duration in seconds (1 hour)
const CACHE_DURATION = 3600;

exports.handler = async function(event, context) {
  try {
    // Set CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET',
      'Cache-Control': `public, max-age=${CACHE_DURATION}`
    };

    // Make the API request - changed to fetch top 20 articles
    const response = await axios.request({
      method: 'GET',
      url: 'https://crypto-news16.p.rapidapi.com/news/top/20',
      headers: {
        'X-RapidAPI-Key': process.env.VITE_RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.VITE_RAPIDAPI_HOST
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    return {
      statusCode: error.response?.status || 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: 'Failed to fetch crypto news' })
    };
  }
};
