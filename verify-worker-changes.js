// Verification script for worker status changes and profile updates
const axios = require('axios');

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Test both methods of updating worker profile
async function verifyWorkerChanges() {
  try {
    console.log('🔍 Starting verification of worker changes implementation');
    
    // Step 1: Get all workers
    console.log('\n1️⃣ Fetching all workers from API...');
    const response = await axios.get(`${API_BASE_URL}/all`);
    
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      console.log('❌ No workers found. Verification cannot proceed.');
      return;
    }
    
    const firstWorker = response.data[0];
    console.log(`✅ Found first worker: ${firstWorker.name} (ID: ${firstWorker.id})`);
    console.log(`   Current status: ${firstWorker.status}`);
    console.log(`   Current phone: ${firstWorker.phone}`);
    
    // Step 2: Test status change with both approaches
    // Approach 1: JSON body with all fields
    console.log('\n2️⃣ Testing status change with JSON body...');
    
    const newStatus = firstWorker.status === 'Active' ? 'Inactive' : 'Active';
    console.log(`   Changing status from ${firstWorker.status} to ${newStatus}`);
    
    try {
      const statusUpdateData = {
        status: newStatus,
        religion: firstWorker.religion || 'Hindu',
        phone: firstWorker.phone || '',
        email: firstWorker.email || '',
        address: firstWorker.address || '',
        service: firstWorker.service || 'Cleaning',
        availability: firstWorker.availability || 'Full-Time'
      };
      
      const jsonBodyResponse = await axios.put(
        `${API_BASE_URL}/update/${firstWorker.id}`, 
        statusUpdateData
      );
      
      console.log(`✅ JSON body update successful. Status code: ${jsonBodyResponse.status}`);
    } catch (jsonError) {
      console.error('❌ JSON body update failed:', jsonError.message);
      if (jsonError.response) {
        console.error(`   Status: ${jsonError.response.status}, Data:`, jsonError.response.data);
      }
      
      // Try approach 2: Query parameters
      console.log('\n   Falling back to query parameters...');
      try {
        const queryResponse = await axios.put(
          `${API_BASE_URL}/update/${firstWorker.id}?new_status=${newStatus}&new_religion=${firstWorker.religion || 'Hindu'}`
        );
        console.log(`✅ Query parameters update successful. Status code: ${queryResponse.status}`);
      } catch (queryError) {
        console.error('❌ Query parameters update also failed:', queryError.message);
        if (queryError.response) {
          console.error(`   Status: ${queryError.response.status}, Data:`, queryError.response.data);
        }
        console.log('❌ Both update methods failed. The API might be unavailable.');
        return;
      }
    }
    
    // Step 3: Verify the changes took effect
    console.log('\n3️⃣ Verifying status change...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/all`);
    const updatedWorker = verifyResponse.data.find(w => w.id === firstWorker.id);
    
    if (updatedWorker) {
      console.log(`   Original status: ${firstWorker.status}`);
      console.log(`   Current status: ${updatedWorker.status}`);
      
      if (updatedWorker.status === newStatus) {
        console.log('✅ Status change verified successfully!');
      } else {
        console.log('❌ Status did not change as expected.');
      }
    } else {
      console.log('❌ Could not find the worker after update. Something went wrong.');
    }
    
    // Revert the status change
    console.log('\n4️⃣ Reverting status change...');
    try {
      const revertData = {
        status: firstWorker.status,
        religion: firstWorker.religion || 'Hindu',
        phone: firstWorker.phone || '',
        email: firstWorker.email || '',
        address: firstWorker.address || '',
        service: firstWorker.service || 'Cleaning',
        availability: firstWorker.availability || 'Full-Time'
      };
      
      await axios.put(`${API_BASE_URL}/update/${firstWorker.id}`, revertData);
      console.log(`✅ Successfully reverted status to ${firstWorker.status}`);
    } catch (revertError) {
      console.log(`❌ Failed to revert status: ${revertError.message}`);
    }
    
    console.log('\n✅ Verification complete!');
    
  } catch (error) {
    console.error('❌ Error during verification:', error.message);
  }
}

// Run the verification script
verifyWorkerChanges();
