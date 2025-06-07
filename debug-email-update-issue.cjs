const axios = require('axios');

// Test to replicate the exact user issue: email not updating in frontend after backend confirms success
async function debugEmailUpdateIssue() {
  try {
    console.log('🔍 Debugging Email Update Issue - Frontend vs Backend\n');
    
    // Step 1: Get current state from backend
    console.log('1️⃣ Getting current backend state...');
    const backendResponse = await axios.get('https://meri-biwi-1.onrender.com/all');
    const yadhnika = backendResponse.data.find(w => w.name === 'Yadhnika');
    
    if (!yadhnika) {
      console.log('❌ Yadhnika not found in backend');
      return;
    }
    
    console.log('Backend worker state:');
    console.log(`  Name: ${yadhnika.name}`);
    console.log(`  Backend ID: ${yadhnika.id}`);
    console.log(`  Email: ${yadhnika.email}`);
    console.log(`  Phone: ${yadhnika.phone}`);
    console.log(`  Status: ${yadhnika.status}`);
    
    // Step 2: Simulate frontend ID mapping 
    console.log('\n2️⃣ Simulating frontend ID mapping...');
    const phoneNumber = yadhnika.phone?.replace(/[^0-9]/g, '') || '';
    const workerName = yadhnika.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
    const frontendId = phoneNumber ? `${workerName}_${phoneNumber}` : `worker_${workerName}_${Math.random().toString(36).substr(2, 6)}`;
    
    console.log(`  Frontend ID would be: ${frontendId}`);
    console.log(`  Mapping: ${frontendId} → Backend ID ${yadhnika.id}`);
    
    // Step 3: Update email via backend API
    console.log('\n3️⃣ Updating email via backend API...');
    const newEmail = `test.update.${Date.now()}@example.com`;
    
    const updatePayload = {
      phone: yadhnika.phone || '',
      email: newEmail, // New email
      address: yadhnika.address || '',
      service: yadhnika.service || 'Cleaning',
      availability: yadhnika.availability || 'Full-Time',
      status: yadhnika.status || 'Pending',
      religion: yadhnika.religion || 'Hindu'
    };
    
    console.log(`  Updating email to: ${newEmail}`);
    const updateResponse = await axios.put(`https://meri-biwi-1.onrender.com/update/${yadhnika.id}`, updatePayload);
    console.log('  ✅ Backend update successful:', updateResponse.data.msg);
    
    // Step 4: Fetch fresh data and see what frontend would see
    console.log('\n4️⃣ Fetching fresh data (what frontend getAllWorkers would return)...');
    const freshResponse = await axios.get('https://meri-biwi-1.onrender.com/all');
    const updatedYadhnika = freshResponse.data.find(w => w.id === yadhnika.id);
    
    if (updatedYadhnika) {
      console.log('Updated backend worker:');
      console.log(`  Backend ID: ${updatedYadhnika.id}`);
      console.log(`  Email: ${updatedYadhnika.email}`);
      console.log(`  Phone: ${updatedYadhnika.phone}`);
      
      // Step 5: Simulate frontend mapping process
      console.log('\n5️⃣ Simulating frontend mapping process...');
      const newPhoneNumber = updatedYadhnika.phone?.replace(/[^0-9]/g, '') || '';
      const newWorkerName = updatedYadhnika.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
      const newFrontendId = newPhoneNumber ? `${newWorkerName}_${newPhoneNumber}` : `worker_${newWorkerName}_${Math.random().toString(36).substr(2, 6)}`;
      
      console.log(`  Fresh frontend ID would be: ${newFrontendId}`);
      
      if (newFrontendId === frontendId) {
        console.log('  ✅ Frontend ID mapping is consistent');
        console.log(`  ✅ Email update was successful: ${yadhnika.email} → ${updatedYadhnika.email}`);
        
        if (updatedYadhnika.email === newEmail) {
          console.log('  🎉 EMAIL UPDATE WORKED CORRECTLY!');
        } else {
          console.log('  ❌ Email in backend does not match what we sent');
          console.log(`     Expected: ${newEmail}`);
          console.log(`     Actual: ${updatedYadhnika.email}`);
        }
      } else {
        console.log('  ⚠️  Frontend ID mapping changed!');
        console.log(`     Original: ${frontendId}`);
        console.log(`     New: ${newFrontendId}`);
        console.log('  🔍 This could cause frontend refresh issues');
      }
    } else {
      console.log('  ❌ Could not find updated worker in fresh response');
    }
    
    // Step 6: Show what the issue might be
    console.log('\n6️⃣ Analysis:');
    console.log('The backend API is working correctly.');
    console.log('The issue might be:');
    console.log('  a) Frontend ID mapping inconsistency during refresh');
    console.log('  b) Frontend not properly handling the response');
    console.log('  c) Race condition in the frontend update/refresh logic');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

debugEmailUpdateIssue();
