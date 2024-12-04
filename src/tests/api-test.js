import axios from 'axios';

async function testTwitterAPI() {
    const options = {
        method: 'GET',
        url: 'https://twitter241.p.rapidapi.com/tweet',
        params: {
            pid: '1631781099415257088'
        },
        headers: {
            'x-rapidapi-key': 'a10d6ce342mshebe3660d6f26f76p15bf55jsna1ad871ba1f5',
            'x-rapidapi-host': 'twitter241.p.rapidapi.com'
        }
    };

    try {
        console.log('Making API request...');
        const response = await axios.request(options);
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error('Error details:');
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request
            console.error('Error message:', error.message);
        }
        throw error;
    }
}

// Execute the test
testTwitterAPI();
