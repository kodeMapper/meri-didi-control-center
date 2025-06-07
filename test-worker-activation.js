const axios = require('axios');

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

async function testWorkerActivation() {
  try {
    console.log('🔍 Testing worker activation behavior...\n');
    
    // Get initial state
    console.log('1️⃣ Getting initial worker status...');
    let response = await axios.get(`${API_BASE_URL}/all`);
    console.log('Initial status:');
    response.data.forEach((worker, index) => {
      console.log(`  Worker ${index + 1}: ${worker.name} - ${worker.status} (${worker.service})`);
    });
    
    // Activate first worker
    console.log('\n2️⃣ Activating worker 1 (Yadhnika)...');
    await axios.put(`${API_BASE_URL}/update/1?new_status=Active`);
    
    // Check after first activation
    response = await axios.get(`${API_BASE_URL}/all`);
    console.log('After activating worker 1:');
    response.data.forEach((worker, index) => {
      console.log(`  Worker ${index + 1}: ${worker.name} - ${worker.status} (${worker.service})`);
    });
    
    // Activate second worker
    console.log('\n3️⃣ Activating worker 2 (Aditya)...');
    await axios.put(`${API_BASE_URL}/update/2?new_status=Active`);
    
    // Check after second activation
    response = await axios.get(`${API_BASE_URL}/all`);
    console.log('After activating worker 2:');
    response.data.forEach((worker, index) => {
      console.log(`  Worker ${index + 1}: ${worker.name} - ${worker.status} (${worker.service})`);
    });
    
    console.log('\n🔍 CRITICAL: Check if worker 1 is still Active after activating worker 2');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testWorkerActivation();
