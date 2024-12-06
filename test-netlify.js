import fetch from 'node-fetch';

async function testNetlifyFunctions() {
  console.log('Testing Netlify Functions...\n');

  // Test Twitter Feed Function
  console.log('Testing Twitter Feed Function...');
  try {
    const twitterResponse = await fetch('http://localhost:8888/.netlify/functions/twitterFeed', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        accounts_input: '@CryptoWizardd'
      })
    });
    
    console.log('Twitter Feed Status:', twitterResponse.status);
    const twitterData = await twitterResponse.json();
    console.log('Twitter Feed Response:', JSON.stringify(twitterData, null, 2));
  } catch (error) {
    console.error('Twitter Feed Error:', error.message);
  }

  // Test Crypto News Function
  console.log('\nTesting Crypto News Function...');
  try {
    const cryptoResponse = await fetch('http://localhost:8888/.netlify/functions/cryptoNews');
    
    console.log('Crypto News Status:', cryptoResponse.status);
    const cryptoData = await cryptoResponse.json();
    console.log('Crypto News Response:', JSON.stringify(cryptoData, null, 2));
  } catch (error) {
    console.error('Crypto News Error:', error.message);
  }
}

testNetlifyFunctions();
