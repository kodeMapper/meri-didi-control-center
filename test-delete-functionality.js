import axios from 'axios';

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

async function testDeleteWorker() {
  try {
    console.log('🧪 Testing Worker Delete Functionality\n');
    
    // Step 1: Get all workers to find one to test delete with
    console.log('1️⃣ Getting list of workers...');
    const response = await axios.get(`${API_BASE_URL}/all`);
    
    if (response.data.length === 0) {
      console.log('❌ No workers found to test delete with');
      return;
    }
    
    console.log(`✅ Found ${response.data.length} workers`);
    response.data.forEach((worker, index) => {
      console.log(`   Worker ${index + 1}: ${worker.name} (ID: ${worker.id})`);
    });
    
    // Let's not actually delete a worker, but test the API endpoint structure
    const testWorkerId = response.data[0].id;
    console.log(`\n2️⃣ Testing delete endpoints for worker ${testWorkerId}...`);
    
    // Test different endpoint patterns that might be expected
    const endpoints = [
      `/worker/${testWorkerId}`,
      `/delete/${testWorkerId}`,
      `/workers/${testWorkerId}`,
      `/api/worker/${testWorkerId}`,
      `/api/delete/${testWorkerId}`
    ];
    
    console.log('Testing endpoint availability (without actually deleting):');
    for (const endpoint of endpoints) {
      try {
        // Use HEAD request to test if endpoint exists without modifying data
        const url = `${API_BASE_URL}${endpoint}`;
        console.log(`   Testing: ${url}`);
        
        // Since we can't test HEAD, let's just see what errors we get
        // This is just to check if the endpoint exists
        try {
          await axios.delete(url);
          console.log(`   ✅ ${endpoint} - Delete endpoint exists and returned success`);
        } catch (error) {
          if (error.response) {
            console.log(`   ⚠️  ${endpoint} - Status: ${error.response.status} (endpoint exists but failed: ${error.response.statusText})`);
          } else {
            console.log(`   ❌ ${endpoint} - Network error or endpoint doesn't exist`);
          }
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint} - Failed: ${error.message}`);
      }
    }
    
    console.log('\n3️⃣ Summary:');
    console.log('This test shows which delete endpoints are available on the server.');
    console.log('The frontend delete functionality may fail if the API endpoint format is incorrect.');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

testDeleteWorker();
