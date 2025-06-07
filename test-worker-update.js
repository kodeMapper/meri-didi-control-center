// Test script for the API worker update feature with the new parameters
import axios from 'axios';

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';
const WORKER_ID = '1'; // Yadhnika's ID

// Test function for approving workers with religion parameter
async function testApproveWorker() {
  try {
    console.log(`Testing worker approval for ID: ${WORKER_ID}...`);
    const response = await axios.put(`${API_BASE_URL}/update/${WORKER_ID}`, {
      status: 'Active',
      religion: 'Hindu'
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    console.log('Worker approval test succeeded!');
  } catch (error) {
    console.error('Error during worker approval test:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Full error:', error.message);
  }
}

// Test function for rejecting workers with religion parameter
async function testRejectWorker() {
  try {
    console.log(`Testing worker rejection for ID: ${WORKER_ID}...`);
    const response = await axios.put(`${API_BASE_URL}/update/${WORKER_ID}`, {
      status: 'Rejected',
      religion: 'Hindu'
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    console.log('Worker rejection test succeeded!');
  } catch (error) {
    console.error('Error during worker rejection test:');
    console.error('Status:', error.response?.status);
    console.error('Error data:', error.response?.data);
    console.error('Full error:', error.message);
  }
}

// Run the tests
async function runTests() {
  console.log('Starting API worker update tests...');
  console.log('====================================');
  
  // Test approve worker
  await testApproveWorker();
  console.log('------------------------------------');
  
  // Wait a moment before the next test
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test reject worker
  await testRejectWorker();
  console.log('====================================');
  console.log('API worker update tests completed!');
}

runTests();
