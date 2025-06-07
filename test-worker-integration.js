// Integration test for all worker update functions
import axios from 'axios';

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';
const WORKER_IDS = ['1', '2', '3']; // Test with all available worker IDs

// Helper function to update worker status
async function updateWorkerStatus(workerId, status, religion = 'Hindu') {
  try {
    console.log(`Updating worker ${workerId} to status: ${status} with religion: ${religion}`);
    const response = await axios.put(`${API_BASE_URL}/update/${workerId}`, {
      status: status,
      religion: religion
    });
    
    console.log(`Worker ${workerId} updated successfully to ${status}`);
    return true;
  } catch (error) {
    console.error(`Failed to update worker ${workerId}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return false;
  }
}

// Test all worker status update functions
async function runIntegrationTest() {
  console.log('Starting worker update integration test...');
  console.log('==========================================');
  
  // Test with multiple religions to verify parameter passing
  const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain'];
  const statuses = ['Active', 'Inactive', 'Pending', 'Rejected'];
  
  let testsPassed = 0;
  let testsFailed = 0;
  
  // Run tests for each worker
  for (const workerId of WORKER_IDS) {
    console.log(`\nTesting worker ID: ${workerId}`);
    console.log('-------------------------------------------');
    
    // Test each status with different religions
    for (let i = 0; i < statuses.length; i++) {
      const status = statuses[i];
      const religion = religions[i % religions.length];
      
      console.log(`Test ${testsPassed + testsFailed + 1}: Setting status = ${status}, religion = ${religion}`);
      const success = await updateWorkerStatus(workerId, status, religion);
      
      if (success) {
        testsPassed++;
        console.log(`✅ Test passed for worker ${workerId}\n`);
      } else {
        testsFailed++;
        console.log(`❌ Test failed for worker ${workerId}\n`);
      }
      
      // Wait briefly between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('==========================================');
  console.log(`Integration tests completed: ${testsPassed} passed, ${testsFailed} failed`);
  console.log(`Success rate: ${Math.round((testsPassed / (testsPassed + testsFailed)) * 100)}%`);
  console.log('==========================================');
}

runIntegrationTest();
