import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testApis() {
  console.log('Testing APIs...\n');

  // Test Twitter API
  console.log('Testing Twitter API endpoint...');
  try {
    const twitterResponse = await fetch('http://localhost:3002/api/twitter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accounts_input: '@CryptoWizardd'
      })
    });
    const twitterData = await twitterResponse.json();
    console.log('Twitter API Response:', JSON.stringify(twitterData, null, 2));
  } catch (error) {
    console.error('Twitter API Error:', error.message);
  }

  // Test Crypto News API
  console.log('\nTesting Crypto News API endpoint...');
  try {
    console.log('RapidAPI Key:', process.env.VITE_RAPIDAPI_KEY);
    console.log('RapidAPI Host:', process.env.VITE_RAPIDAPI_HOST);
    
    const cryptoResponse = await fetch('https://crypto-news16.p.rapidapi.com/news/top/50', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.VITE_RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.VITE_RAPIDAPI_HOST
      }
    });
    
    console.log('Crypto News API Status:', cryptoResponse.status);
    console.log('Crypto News API Status Text:', cryptoResponse.statusText);
    
    const cryptoData = await cryptoResponse.json();
    console.log('Crypto News API Response:', JSON.stringify(cryptoData, null, 2));
  } catch (error) {
    console.error('Crypto News API Error:', error.message);
    if (error.response) {
      console.error('Error Response:', await error.response.text());
    }
  }
}

testApis();
