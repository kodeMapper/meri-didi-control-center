// Test to simulate the exact frontend edit worker flow
const axios = require('axios');

// Simulate the frontend mapping function 
function getFrontendWorkerId(workerData, backendIndex) {
  const phoneNumber = workerData.phone?.replace(/[^0-9]/g, '') || '';
  const workerName = workerData.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
  
  if (!phoneNumber) {
    const fallbackId = `worker_${workerName}_${Math.random().toString(36).substr(2, 6)}`;
    return fallbackId;
  }
  
  const frontendId = `${workerName}_${phoneNumber}`;
  return frontendId;
}

// Simulate the frontend mapBackendWorkerToWorker function
function mapBackendWorkerToWorker(workerData, index) {
  const workerId = getFrontendWorkerId(workerData, index);
  
  return {
    id: workerId,
    fullName: workerData.name || "",
    email: workerData.email || "",
    phone: workerData.phone || "",
    address: workerData.address || "",
    city: workerData.city || "Mumbai",
    gender: workerData.gender || "Male",
    dateOfBirth: workerData.date_of_birth || "",
    serviceType: workerData.service || "Cleaning",
    experience: workerData.experience || 0,
    availability: workerData.availability || "Full-Time",
    idType: workerData.id_type || "Aadhar Card",
    idNumber: workerData.id_number || "",
    about: workerData.about || "",
    skills: workerData.skills?.split(',').map(s => s.trim()) || [],
    status: workerData.status || "Pending",
    rating: workerData.rating || 0,
    totalBookings: workerData.total_bookings || 0,
    completionRate: workerData.completion_rate || 0,
    joiningDate: workerData.joining_date || "",
    createdAt: workerData.created_at || new Date().toISOString(),
    updatedAt: workerData.updated_at || new Date().toISOString(),
    idProofUrl: workerData.id_proof_url || null,
    photoUrl: workerData.photo_url || null,
    religion: workerData.religion || "Hindu",
  };
}

async function simulateFrontendEditFlow() {
  try {
    console.log('🎭 Simulating Exact Frontend Edit Worker Flow\n');
    
    // Step 1: Simulate loading worker (like EditWorkerPage useEffect)
    console.log('1️⃣ Simulating initial worker load...');
    const response = await axios.get('https://meri-biwi-1.onrender.com/all');
    const mappedWorkers = response.data.map((worker, index) => mapBackendWorkerToWorker(worker, index));
    
    // Find Yadhnika
    const targetId = 'yadhnika_9876543210'; // This is what the frontend URL would have
    const foundWorker = mappedWorkers.find(w => w.id === targetId);
    
    if (!foundWorker) {
      console.log('❌ Worker not found with frontend ID:', targetId);
      console.log('Available worker IDs:', mappedWorkers.map(w => w.id));
      return;
    }
    
    console.log('✅ Found worker:', foundWorker.fullName);
    console.log('  Frontend ID:', foundWorker.id);
    console.log('  Current email:', foundWorker.email);
    
    // Step 2: Simulate user editing email
    console.log('\n2️⃣ Simulating email edit...');
    const originalEmail = foundWorker.email;
    const newEmail = `frontend.test.${Date.now()}@example.com`;
    
    const editableData = {
      phone: foundWorker.phone || '',
      email: newEmail, // User changed this
      address: foundWorker.address || '',
      service: foundWorker.serviceType || 'Cleaning',
      availability: foundWorker.availability || '',
      status: foundWorker.status || 'Pending',
      religion: foundWorker.religion || 'Hindu'
    };
    
    console.log(`  Changed email: ${originalEmail} → ${newEmail}`);
    
    // Step 3: Simulate API call (what updateWorkerProfile does)
    console.log('\n3️⃣ Simulating API update call...');
    
    // Backend ID resolution (this is what findAndCacheBackendId does)
    const backendWorker = response.data.find(w => w.name === 'Yadhnika');
    const backendId = backendWorker.id;
    
    console.log(`  Resolved backend ID: ${backendId}`);
    
    // Make the update call
    const updatePayload = {
      status: editableData.status,
      religion: editableData.religion,
      phone: editableData.phone,
      email: editableData.email,
      address: editableData.address,
      service: editableData.service,
      availability: editableData.availability
    };
    
    console.log('  Sending update payload:', JSON.stringify(updatePayload, null, 2));
    
    const updateResponse = await axios.put(`https://meri-biwi-1.onrender.com/update/${backendId}`, updatePayload);
    console.log('  ✅ API update successful');
    
    // Step 4: Simulate refresh (what the frontend does after update)
    console.log('\n4️⃣ Simulating frontend refresh...');
    const refreshResponse = await axios.get('https://meri-biwi-1.onrender.com/all');
    const refreshedMappedWorkers = refreshResponse.data.map((worker, index) => mapBackendWorkerToWorker(worker, index));
    
    // Try to find the worker again
    const refreshedWorker = refreshedMappedWorkers.find(w => w.id === targetId);
    
    if (refreshedWorker) {
      console.log('✅ Found refreshed worker');
      console.log(`  Email after refresh: ${refreshedWorker.email}`);
      
      if (refreshedWorker.email === newEmail) {
        console.log('  🎉 SUCCESS! Email was properly updated and refreshed');
      } else {
        console.log('  ❌ PROBLEM! Email in refreshed data does not match');
        console.log(`     Expected: ${newEmail}`);
        console.log(`     Got: ${refreshedWorker.email}`);
      }
    } else {
      console.log('  ❌ PROBLEM! Could not find worker after refresh');
      console.log('     Available IDs after refresh:', refreshedMappedWorkers.map(w => w.id));
    }
    
    console.log('\n5️⃣ Conclusion:');
    if (refreshedWorker && refreshedWorker.email === newEmail) {
      console.log('The frontend logic is working correctly.');
      console.log('The issue might be:');
      console.log('  - UI not re-rendering after state update');
      console.log('  - Form still showing old cached values');
      console.log('  - State management issue in React components');
    } else {
      console.log('There is a bug in the frontend refresh logic.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

simulateFrontendEditFlow();
