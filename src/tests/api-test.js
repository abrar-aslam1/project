const axios = require('axios');

async function testLocalTwitterAPI() {
  try {
    console.log('Testing local Twitter API endpoint...');
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:3002/api/twitter',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        user_input: '@SilverBulletBTC'
      }
    });

    console.log('API Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error details:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    if (error.config) {
      console.error('Error config:', error.config);
    }
  }
}

testLocalTwitterAPI();
