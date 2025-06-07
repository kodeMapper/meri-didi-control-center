// Test script for worker status changes
const axios = require('axios');

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';
const WORKER_ID = '1'; // Yadhnika's ID

async function testStatusChange(status, religion = 'Hindu') {
  console.log(`\n--- Testing status change to: ${status} ---`);
  
  try {
    const response = await axios.put(`${API_BASE_URL}/update/${WORKER_ID}`, {
      status: status,
      religion: religion
    });
    
    console.log('Status Code:', response.status);
    console.log('Response:', response.data);
    
    return response.status === 200;
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
    return false;
  }
}

async function getWorkerStatus(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    const worker = response.data.find(w => {
      // Try to find worker by ID or phone number
      return w.id === id || (w.phone && w.phone.includes('9620393109'));
    });
    
    if (worker) {
      console.log(`Current status of worker ${worker.name}: ${worker.status}`);
      return worker.status;
    } else {
      console.log('Worker not found');
      return null;
    }
  } catch (error) {
    console.error('Error getting worker status:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('Starting worker status change tests');
  
  // Get initial status
  let currentStatus = await getWorkerStatus(WORKER_ID);
  
  // Test each status
  const statuses = ['Active', 'Inactive', 'Rejected', 'Pending'];
  
  for (const status of statuses) {
    if (status === currentStatus) {
      console.log(`Worker is already in ${status} state. Skipping...`);
      continue;
    }
    
    const success = await testStatusChange(status);
    
    if (success) {
      console.log(`Successfully changed status to ${status}`);
      // Verify the status was actually changed
      const newStatus = await getWorkerStatus(WORKER_ID);
      if (newStatus === status) {
        console.log('✅ Status change verified');
      } else {
        console.log('❌ Status change failed verification');
      }
    } else {
      console.log(`Failed to change status to ${status}`);
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Return to Active status at the end
  if (await getWorkerStatus(WORKER_ID) !== 'Active') {
    console.log('\n--- Returning worker to Active status ---');
    const success = await testStatusChange('Active');
    if (success) {
      console.log('Worker returned to Active status');
    }
  }
  
  console.log('\nAll tests completed!');
}

runTests().catch(console.error);
