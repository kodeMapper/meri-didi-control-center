const axios = require('axios');

// Test the actual edit worker functionality with the same data structure as frontend
async function debugEditWorker() {
  try {
    console.log('🔍 Debugging Edit Worker Functionality\n');
    
    // Step 1: Get current worker data
    console.log('1️⃣ Fetching current worker data...');
    const response = await axios.get('https://meri-biwi-1.onrender.com/all');
    const worker = response.data.find(w => w.name === 'Yadhnika'); // Test with Yadhnika
    
    if (!worker) {
      console.log('❌ Worker not found');
      return;
    }
    
    console.log('Current worker data:');
    console.log(`  Name: ${worker.name}`);
    console.log(`  Email: ${worker.email}`);
    console.log(`  Phone: ${worker.phone}`);
    console.log(`  Status: ${worker.status}`);
    console.log(`  Religion: ${worker.religion}`);
    console.log(`  Service: ${worker.service}`);
    console.log(`  Address: ${worker.address}`);
    console.log(`  Availability: ${worker.availability}`);
    
    // Step 2: Test email update (what the user is trying to do)
    console.log('\n2️⃣ Testing email update...');
    const newEmail = 'updated.email@example.com';
    
    // Simulate the exact payload that the frontend would send
    const updatePayload = {
      phone: worker.phone || '',
      email: newEmail, // This is what we're changing
      address: worker.address || '',
      service: worker.service || 'Cleaning',
      availability: worker.availability || 'Full-Time',
      status: worker.status || 'Pending',
      religion: worker.religion || 'Hindu'
    };
    
    console.log('Sending update payload:');
    console.log(JSON.stringify(updatePayload, null, 2));
    
    const updateResponse = await axios.put(`https://meri-biwi-1.onrender.com/update/${worker.id}`, updatePayload);
    console.log('\n✅ Update response:', updateResponse.data);
    
    // Step 3: Verify the change
    console.log('\n3️⃣ Verifying the change...');
    const verifyResponse = await axios.get('https://meri-biwi-1.onrender.com/all');
    const updatedWorker = verifyResponse.data.find(w => w.id === worker.id);
    
    if (updatedWorker) {
      console.log('Updated worker data:');
      console.log(`  Email: ${worker.email} → ${updatedWorker.email}`);
      
      if (updatedWorker.email === newEmail) {
        console.log('✅ Email was successfully updated!');
      } else {
        console.log('❌ Email was NOT updated. Something is wrong.');
        console.log('Expected:', newEmail);
        console.log('Actual:', updatedWorker.email);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

debugEditWorker();
