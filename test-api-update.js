const axios = require('axios');

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

async function testWorkerStatusUpdate() {
  try {
    console.log('=== Testing Worker Status Update ===');

    // 1. Get current workers
    console.log('\nStep 1: Getting current workers...');
    const response = await axios.get(`${API_BASE_URL}/all`);
    if (response.data.length === 0) {
      console.log('No workers found in the database.');
      return;
    }
    
    const worker = response.data[0];
    console.log(`Found worker: ${worker.name} (ID: ${worker.id}), Current status: ${worker.status}`);
    
    // 2. Update worker status with JSON body
    console.log('\nStep 2: Updating worker status...');
    const newStatus = worker.status === 'Active' ? 'Pending' : 'Active';
    console.log(`Changing status from ${worker.status} to ${newStatus}`);
    
    try {
      const updateResponse = await axios.put(`${API_BASE_URL}/update/${worker.id}`, {
        status: newStatus,
        religion: worker.religion || 'Hindu'
      });
      
      console.log('Update successful! Response:', updateResponse.data);
    } catch (error) {
      console.error('Error during update:', error.response?.data || error.message);
      if (error.response) {
        console.error('Status code:', error.response.status);
        console.error('Headers:', error.response.headers);
      }
      return;
    }
    
    // 3. Verify the update
    console.log('\nStep 3: Verifying the update...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/all`);
    const updatedWorker = verifyResponse.data.find(w => w.id === worker.id);
    
    if (updatedWorker) {
      console.log(`Worker status is now: ${updatedWorker.status}`);
      if (updatedWorker.status === newStatus) {
        console.log('✅ Update verified successfully!');
      } else {
        console.log('❌ Update failed - status was not changed.');
      }
    } else {
      console.log('Could not find worker in response.');
    }
    
  } catch (error) {
    console.error('Error during test:', error.message);
  }
}

testWorkerStatusUpdate();
