import axios from 'axios';

async function testTwitterAPI() {
  try {
    console.log('Testing Twitter API...');
    const response = await axios({
      method: 'POST',
      url: 'https://api-lr.agent.ai/v1/agent/vqe8j2qer4ci8o0u/webhook/33c0ca2e',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        accounts_input: '@CryptoWizardd'
      }
    });

    // Log the full response structure
    console.log('Full API Response Structure:', JSON.stringify(response.data, null, 2));

    // Check for any media-related fields
    const tweets = response.data.response.response;
    tweets.forEach((tweet, index) => {
      console.log(`\nTweet ${index + 1}:`);
      console.log('- Text:', tweet.text);
      // Log all available fields to find media-related data
      Object.keys(tweet).forEach(key => {
        console.log(`- ${key}:`, tweet[key]);
      });
    });
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

console.log('Starting API test...');
testTwitterAPI().catch(error => {
  console.error('Unhandled error:', error.message);
});
