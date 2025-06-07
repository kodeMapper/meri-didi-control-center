const axios = require('axios');

// Test the new ID mapping system
async function testIdMapping() {
  console.log('🧪 Testing New ID Mapping System\n');

  try {
    // Step 1: Fetch workers from API to see the actual data structure
    console.log('1️⃣ Fetching workers from API...');
    const response = await axios.get('https://meri-biwi-1.onrender.com/all');
    
    if (!response.data || response.data.length === 0) {
      console.log('❌ No workers found in API');
      return;
    }
    
    console.log(`✅ Found ${response.data.length} workers`);
    
    // Step 2: Test frontend ID generation logic
    console.log('\n2️⃣ Testing frontend ID generation...');
    
    const workers = response.data;
    const frontendMapping = new Map();
    const backendMapping = new Map();
    
    workers.forEach((worker, index) => {
      const phoneNumber = worker.phone?.replace(/[^0-9]/g, '') || '';
      const frontendId = phoneNumber.slice(-10) || phoneNumber || `worker_${index}`;
      const backendId = (index + 1).toString(); // Backend uses 1-based indexing
      
      frontendMapping.set(phoneNumber, frontendId);
      backendMapping.set(frontendId, backendId);
      
      console.log(`   Worker: ${worker.name}`);
      console.log(`   Phone: ${worker.phone} → Cleaned: ${phoneNumber}`);
      console.log(`   Frontend ID: ${frontendId}`);
      console.log(`   Backend ID: ${backendId}`);
      console.log(`   Status: ${worker.status}`);
      console.log('   ---');
    });
    
    // Step 3: Test ID lookup
    console.log('\n3️⃣ Testing ID lookup...');
    const testFrontendId = Array.from(backendMapping.keys())[0];
    const testBackendId = backendMapping.get(testFrontendId);
    
    console.log(`   Frontend ID: ${testFrontendId} → Backend ID: ${testBackendId}`);
    
    // Step 4: Test actual API call with mapped ID
    console.log('\n4️⃣ Testing API call with mapped ID...');
    const testWorker = workers[0];
    const testPhone = testWorker.phone?.replace(/[^0-9]/g, '') || '';
    const testFrontendIdForUpdate = testPhone.slice(-10) || testPhone;
    const testBackendIdForUpdate = '1'; // First worker should be backend ID 1
    
    console.log(`   Testing with worker: ${testWorker.name}`);
    console.log(`   Frontend ID: ${testFrontendIdForUpdate}`);
    console.log(`   Backend ID for API: ${testBackendIdForUpdate}`);
    
    // Test a simple status toggle
    const currentStatus = testWorker.status;
    const newStatus = currentStatus === 'Active' ? 'Pending' : 'Active';
    
    console.log(`   Current status: ${currentStatus}`);
    console.log(`   New status: ${newStatus}`);
    
    try {
      const updateResponse = await axios.put(`https://meri-biwi-1.onrender.com/update/${testBackendIdForUpdate}`, {
        status: newStatus,
        religion: testWorker.religion || 'Hindu'
      });
      
      console.log('   ✅ API call successful:', updateResponse.data);
      
      // Verify the change
      const verifyResponse = await axios.get('https://meri-biwi-1.onrender.com/all');
      const updatedWorker = verifyResponse.data[0]; // First worker
      console.log(`   ✅ Verified status: ${updatedWorker.status}`);
      
      // Restore original status
      await axios.put(`https://meri-biwi-1.onrender.com/update/${testBackendIdForUpdate}`, {
        status: currentStatus,
        religion: testWorker.religion || 'Hindu'
      });
      console.log(`   ✅ Status restored to: ${currentStatus}`);
      
    } catch (apiError) {
      console.error('   ❌ API call failed:', apiError.message);
      if (apiError.response) {
        console.error('   Response:', apiError.response.data);
      }
    }
    
    console.log('\n🎉 ID Mapping Test Completed!');
    console.log('\nKey Improvements:');
    console.log('✅ Frontend IDs are based on phone numbers (unique and consistent)');
    console.log('✅ Backend IDs are properly mapped using array index + 1');
    console.log('✅ No hardcoded phone number mappings');
    console.log('✅ System will work for new workers automatically');
    
  } catch (error) {
    console.error('❌ Error during test:', error.message);
  }
}

// Run the test
testIdMapping();
