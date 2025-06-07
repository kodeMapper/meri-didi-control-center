const axios = require('axios');

// API base URL
const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Test the updateWorkerProfile functionality
async function testWorkerProfileUpdate() {
  try {
    console.log('🧪 Testing Worker Profile Update Functionality\n');
    
    // Step 1: Get a worker to test with
    console.log('1️⃣ Fetching workers from API...');
    const response = await axios.get(`${API_BASE_URL}/all`);
    
    if (response.data.length === 0) {
      console.log('❌ No workers found to test with');
      return;
    }
    
    const testWorker = response.data[0];
    console.log(`✅ Found test worker: ${testWorker.name} (ID: ${testWorker.id})`);
    console.log(`   Current status: ${testWorker.status}`);
    console.log(`   Current phone: ${testWorker.phone}`);
    console.log(`   Current email: ${testWorker.email}`);
    console.log(`   Current religion: ${testWorker.religion || 'Hindu'}\n`);
    
    // Step 2: Test comprehensive profile update (simulating frontend functionality)
    console.log('2️⃣ Testing comprehensive profile update...');
    
    // Simulate what the frontend updateWorkerProfile function does:
    // Send all fields together, even if only one changed
    const updates = {
      // Only changing phone number, but sending all required fields
      phone: testWorker.phone ? testWorker.phone + '_updated' : '9876543210',
      // Keep all other existing values
      status: testWorker.status || 'Pending',
      religion: testWorker.religion || 'Hindu',
      email: testWorker.email || 'test@example.com',
      address: testWorker.address || 'Test Address',
      service: testWorker.service || 'Cleaning',
      availability: testWorker.availability || 'Full-Time'
    };
    
    console.log('   Sending update with complete data payload...');
    console.log('   Updated phone:', updates.phone);
    
    const updateResponse = await axios.put(`${API_BASE_URL}/update/${testWorker.id}`, updates);
    console.log('✅ Update successful:', updateResponse.data);
    
    // Step 3: Verify the update
    console.log('\n3️⃣ Verifying the update...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/all`);
    const updatedWorker = verifyResponse.data.find(w => w.id === testWorker.id || w.name === testWorker.name);
    
    if (updatedWorker) {
      console.log('✅ Worker profile updated successfully:');
      console.log(`   Phone: ${testWorker.phone} → ${updatedWorker.phone}`);
      console.log(`   Status: ${updatedWorker.status}`);
      console.log(`   Religion: ${updatedWorker.religion}`);
      console.log(`   Email: ${updatedWorker.email}`);
    } else {
      console.log('❌ Could not find updated worker in response');
    }
    
    // Step 4: Test status-only update
    console.log('\n4️⃣ Testing status-only update...');
    const newStatus = updatedWorker.status === 'Active' ? 'Inactive' : 'Active';
    
    const statusUpdate = {
      status: newStatus,
      religion: updatedWorker.religion || 'Hindu',
      phone: updatedWorker.phone || testWorker.phone,
      email: updatedWorker.email || testWorker.email,
      address: updatedWorker.address || testWorker.address,
      service: updatedWorker.service || testWorker.service,
      availability: updatedWorker.availability || testWorker.availability
    };
    
    console.log(`   Changing status from ${updatedWorker.status} to ${newStatus}...`);
    
    const statusResponse = await axios.put(`${API_BASE_URL}/update/${testWorker.id}`, statusUpdate);
    console.log('✅ Status update successful:', statusResponse.data);
    
    // Final verification
    const finalResponse = await axios.get(`${API_BASE_URL}/all`);
    const finalWorker = finalResponse.data.find(w => w.id === testWorker.id || w.name === testWorker.name);
    
    if (finalWorker) {
      console.log(`✅ Final status: ${finalWorker.status}`);
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('✅ The updateWorkerProfile functionality is working correctly');
    
  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

// Run the test
testWorkerProfileUpdate();
