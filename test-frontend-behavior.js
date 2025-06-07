const axios = require('axios');

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

async function testFrontendBehavior() {
  console.log('=== Frontend Behavior Test ===\n');
  
  try {
    // Step 1: Get initial state
    console.log('1. Getting initial worker states...');
    let response = await axios.get(`${API_BASE_URL}/all`);
    console.log('Initial state:', response.data.map(w => `${w.name}: ${w.status}`).join(', '));
    
    // Step 2: Set both workers to Active
    console.log('\n2. Setting both workers to Active...');
    await axios.put(`${API_BASE_URL}/update/1?new_status=Active`);
    await axios.put(`${API_BASE_URL}/update/3?new_status=Active`);
    
    response = await axios.get(`${API_BASE_URL}/all`);
    console.log('After setting both Active:', response.data.map(w => `${w.name}: ${w.status}`).join(', '));
    
    // Step 3: Activate one worker (simulate frontend action)
    console.log('\n3. Simulating frontend activation of Worker 1 (Yadhnika)...');
    const updateResponse = await axios.put(`${API_BASE_URL}/update/1?new_status=Active`);
    console.log('Update response:', updateResponse.data);
    
    // Step 4: Check immediate state
    response = await axios.get(`${API_BASE_URL}/all`);
    console.log('State immediately after activation:', response.data.map(w => `${w.name}: ${w.status}`).join(', '));
    
    // Step 5: Wait a moment and check again (simulate frontend refresh)
    console.log('\n4. Waiting 1 second and checking again...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    response = await axios.get(`${API_BASE_URL}/all`);
    console.log('State after 1 second:', response.data.map(w => `${w.name}: ${w.status}`).join(', '));
    
    // Step 6: Test with the other worker
    console.log('\n5. Now activating Worker 3 (Test_Entry)...');
    const updateResponse2 = await axios.put(`${API_BASE_URL}/update/3?new_status=Active`);
    console.log('Update response:', updateResponse2.data);
    
    response = await axios.get(`${API_BASE_URL}/all`);
    console.log('Final state:', response.data.map(w => `${w.name}: ${w.status}`).join(', '));
    
    // Summary
    console.log('\n=== SUMMARY ===');
    const activeWorkers = response.data.filter(w => w.status === 'Active');
    console.log(`Number of active workers: ${activeWorkers.length}`);
    console.log(`Active workers: ${activeWorkers.map(w => w.name).join(', ')}`);
    
    if (activeWorkers.length > 1) {
      console.log('✅ RESULT: Multiple workers can be active simultaneously');
    } else {
      console.log('❌ RESULT: Only one worker can be active at a time');
    }
    
  } catch (error) {
    console.error('Error during test:', error.message);
  }
}

testFrontendBehavior();
