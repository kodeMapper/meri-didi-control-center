// Simple API connection test
const axios = require('axios');

async function testAPIConnection() {
  console.log('Testing API connection...');
  try {
    const response = await axios.get('https://meri-biwi-1.onrender.com/all');
    console.log(`API responded with status: ${response.status}`);
    console.log(`Found ${response.data.length} workers in response`);
    console.log('First worker:', JSON.stringify(response.data[0], null, 2));
    console.log('API connection successful');
    return true;
  } catch (error) {
    console.error('API connection failed:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    }
    return false;
  }
}

testAPIConnection();
