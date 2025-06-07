const axios = require('axios');

// API base URL
const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

async function testWorkerUpdate() {
  try {
    console.log('=== Testing Worker Update Fix ===\n');
    
    // Step 1: Get current workers
    console.log('1. Getting current workers...');
    const response = await axios.get(`${API_BASE_URL}/all`);
    console.log('Found worker(s):');
    response.data.forEach((worker, index) => {
      console.log(`  Worker ${index + 1}: ${worker.name} (ID: ${worker.id}) - Status: ${worker.status}`);
    });
    
    // Step 2: Try to update with the new parameters
    if (response.data.length > 0) {
      const workerId = response.data[0].id;
      console.log(`\n2. Testing update with worker ID ${workerId}...`);
      
      try {
        // Toggle status
        const currentStatus = response.data[0].status;
        const newStatus = currentStatus === 'Active' ? 'Pending' : 'Active';
        console.log(`   Current status: ${currentStatus}, changing to: ${newStatus}`);
        
        const updateResponse = await axios.put(
          `${API_BASE_URL}/update/${workerId}?new_status=${newStatus}&new_religion=Hindu`
        );
        console.log('Update response:', updateResponse.data);
        console.log('✅ Update successful!');
      } catch (error) {
        console.error('❌ Update failed:', error.response?.data || error.message);
      }
      
      // Step 3: Verify the change
      console.log('\n3. Verifying status change...');
      const verifyResponse = await axios.get(`${API_BASE_URL}/all`);
      const updatedWorker = verifyResponse.data.find(w => w.id === workerId);
      
      if (updatedWorker) {
        console.log(`   Worker ${workerId} now has status: ${updatedWorker.status}`);
      } else {
        console.log(`   Could not find worker with ID ${workerId} in response`);
      }
    }
    
  } catch (error) {
    console.error('Error during test:', error.message);
  }
}

testWorkerUpdate();
