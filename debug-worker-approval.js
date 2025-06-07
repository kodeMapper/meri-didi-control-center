const axios = require('axios');

// API base URL
const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

async function debugWorkerApproval() {
  try {
    console.log('=== Worker Approval/Rejection Debug ===\n');
    
    // Step 1: Get current workers
    console.log('1. Getting current workers...');
    const response = await axios.get(`${API_BASE_URL}/all`);
    console.log('Current workers:');
    response.data.forEach((worker, index) => {
      console.log(`  Worker ${index}: ${worker.name} (Phone: ${worker.phone}) - Status: ${worker.status}`);
    });
    
    // Step 2: Try to update worker status directly
    if (response.data.length > 0) {
      console.log('\n2. Testing worker with Yadhnika (ID should be 1)...');
      const yadWorker = response.data.find(w => w.phone && w.phone.includes('9620393109'));
      
      if (yadWorker) {
        console.log(`Found Yadhnika: ${yadWorker.name}, Status: ${yadWorker.status}`);
        
        // Toggle status - if Active make Pending, if Pending make Active
        const newStatus = yadWorker.status === 'Active' ? 'Pending' : 'Active';
        console.log(`Changing status to: ${newStatus}`);
        
        try {
          const updateResponse = await axios.put(`${API_BASE_URL}/update/1?new_status=${newStatus}`);
          console.log('✅ Update response:', updateResponse.data);
        } catch (error) {
          console.log('❌ Update failed:', error.response?.data || error.message);
          console.log('Full error details:', error);
        }
      } else {
        console.log('Could not find Yadhnika, trying worker index 0');
        const testWorker = response.data[0];
        
        // Try to approve the first worker we find
        console.log(`Testing with ${testWorker.name}, Current status: ${testWorker.status}`);
        
        // Try worker IDs 1, 2, and 3 to see which one works
        for (const id of [1, 2, 3]) {
          try {
            console.log(`\nTrying to update worker with ID: ${id} to Active status...`);
            const updateResponse = await axios.put(`${API_BASE_URL}/update/${id}?new_status=Active`);
            console.log(`✅ Update for ID ${id} response:`, updateResponse.data);
          } catch (error) {
            console.log(`❌ Update for ID ${id} failed:`, error.response?.data || error.message);
          }
        }
      }
    } else {
      console.log('No workers available to test');
    }
    
    // Step 3: Check if status was updated
    console.log('\n3. Verifying status changes...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/all`);
    console.log('Updated worker list:');
    verifyResponse.data.forEach((worker, index) => {
      console.log(`  Worker ${index}: ${worker.name} (Phone: ${worker.phone}) - Status: ${worker.status}`);
    });
    
  } catch (error) {
    console.error('Error running tests:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

debugWorkerApproval();
