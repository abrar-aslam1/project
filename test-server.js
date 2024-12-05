import axios from 'axios';

async function testServer() {
  try {
    console.log('Testing server...');
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:3002/api/twitter',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        accounts_input: '@CryptoWizardd'
      }
    });

    console.log('Server response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

console.log('Starting server test...');
testServer();
