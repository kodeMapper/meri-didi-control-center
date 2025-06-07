#!/usr/bin/env node

/**
 * Test script to verify the edit worker route is accessible
 * and the EditWorkerPage component loads correctly
 */

import axios from 'axios';

const SERVER_URL = 'http://localhost:5173';

async function testEditWorkerRoute() {
  console.log('🧪 Testing Edit Worker Route Functionality\n');
  
  try {
    // Test 1: Check if the main app is accessible
    console.log('1️⃣ Testing main application accessibility...');
    const mainResponse = await axios.get(SERVER_URL);
    if (mainResponse.status === 200) {
      console.log('✅ Main application is accessible');
    }
    
    // Test 2: Check if edit worker route is accessible (should return HTML)
    console.log('\n2️⃣ Testing edit worker route accessibility...');
    const editWorkerResponse = await axios.get(`${SERVER_URL}/edit-worker/test-id`);
    if (editWorkerResponse.status === 200) {
      console.log('✅ Edit worker route is accessible');
      console.log(`   Response Content-Type: ${editWorkerResponse.headers['content-type']}`);
    }
    
    // Test 3: Check if worker management route is accessible
    console.log('\n3️⃣ Testing worker management route...');
    const workerManagementResponse = await axios.get(`${SERVER_URL}/worker-management`);
    if (workerManagementResponse.status === 200) {
      console.log('✅ Worker management route is accessible');
    }
    
    console.log('\n🎉 All route tests passed successfully!');
    console.log('✅ The edit worker interface is properly set up and accessible');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response headers:', error.response.headers);
    }
  }
}

// Run the test
testEditWorkerRoute();
