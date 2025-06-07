// Debug script to check worker count discrepancy between backend and frontend
const axios = require('axios');

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Function to normalize worker status to valid frontend values
function normalizeWorkerStatus(backendStatus) {
  if (!backendStatus) return 'Pending';
  
  const status = backendStatus.toLowerCase();
  
  // Map common variations to standard statuses
  // Check for inactive first (before checking for active)
  if (status.includes('inactive') || status.includes('deactive')) {
    return 'Inactive';
  }
  
  if (status.includes('active') || status.includes('approved') || status.includes('super')) {
    return 'Active';
  }
  
  if (status.includes('reject')) {
    return 'Rejected';
  }
  
  if (status.includes('pending') || status.includes('review')) {
    return 'Pending';
  }
  
  // Handle edge cases like "string" or other invalid values
  if (status === 'string' || status.length < 3) {
    return 'Pending'; // Default to Pending for invalid statuses
  }
  
  // Default to Pending for any unrecognized status
  console.warn(`Unknown worker status "${backendStatus}" mapped to "Pending"`);
  return 'Pending';
}

// Function to map backend worker data to our Worker type (replicated from frontend)
function mapBackendWorkerToWorker(workerData, index) {
  // Get the consistent frontend ID for this worker
  const phoneNumber = workerData.phone?.replace(/[^0-9]/g, '') || '';
  const workerName = workerData.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
  
  let workerId;
  if (!phoneNumber) {
    // Fallback for workers without phone numbers
    workerId = `worker_${workerName}_${Math.random().toString(36).substr(2, 6)}`;
  } else {
    // Create a frontend ID using the name and phone number
    workerId = `${workerName}_${phoneNumber}`;
  }
  
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
    status: normalizeWorkerStatus(workerData.status), // Use normalized status
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

async function debugWorkerCount() {
  try {
    console.log('🔍 Debugging Worker Count Discrepancy\n');
    
    // Step 1: Get raw backend data
    console.log('1️⃣ Fetching raw backend data...');
    const response = await axios.get(`${API_BASE_URL}/all`);
    
    console.log(`📊 Backend API returned ${response.data.length} workers:`);
    response.data.forEach((worker, index) => {
      console.log(`   Worker ${index + 1}: ${worker.name} (Backend ID: ${worker.id}) - Status: ${worker.status} - Phone: ${worker.phone}`);
    });
    
    console.log('\n2️⃣ Mapping workers using frontend logic...');
    const mappedWorkers = response.data.map((worker, index) => mapBackendWorkerToWorker(worker, index));
    
    console.log(`📊 Frontend mapped ${mappedWorkers.length} workers:`);
    mappedWorkers.forEach((worker, index) => {
      console.log(`   Worker ${index + 1}: ${worker.fullName} (Frontend ID: ${worker.id}) - Status: ${worker.status} - Phone: ${worker.phone}`);
    });
    
    console.log('\n3️⃣ Checking for filtering by status...');
    const activeWorkers = mappedWorkers.filter(worker => worker.status === 'Active');
    const inactiveWorkers = mappedWorkers.filter(worker => worker.status === 'Inactive'); 
    const pendingWorkers = mappedWorkers.filter(worker => worker.status === 'Pending');
    const rejectedWorkers = mappedWorkers.filter(worker => worker.status === 'Rejected');
    
    console.log(`📈 Worker counts by status:`);
    console.log(`   Active: ${activeWorkers.length}`);
    console.log(`   Inactive: ${inactiveWorkers.length}`);
    console.log(`   Pending: ${pendingWorkers.length}`);
    console.log(`   Rejected: ${rejectedWorkers.length}`);
    console.log(`   Total: ${activeWorkers.length + inactiveWorkers.length + pendingWorkers.length + rejectedWorkers.length}`);
    
    console.log('\n4️⃣ Checking if all workers are being displayed...');
    const totalDisplayed = activeWorkers.length + inactiveWorkers.length + pendingWorkers.length + rejectedWorkers.length;
    
    if (totalDisplayed < response.data.length) {
      console.log(`❌ ISSUE FOUND: Only ${totalDisplayed} workers displayed out of ${response.data.length} in backend`);
      
      // Find missing workers
      console.log('\n5️⃣ Analyzing missing workers...');
      const displayedIds = mappedWorkers.map(w => w.id);
      response.data.forEach((backendWorker, index) => {
        const expectedFrontendId = mapBackendWorkerToWorker(backendWorker, index).id;
        if (!displayedIds.includes(expectedFrontendId)) {
          console.log(`   Missing: ${backendWorker.name} (Backend ID: ${backendWorker.id}) - Status: ${backendWorker.status}`);
        }
      });
    } else {
      console.log(`✅ All ${response.data.length} workers are being mapped and displayed correctly`);
    }
    
    console.log('\n6️⃣ Checking for duplicate mappings...');
    const frontendIds = mappedWorkers.map(w => w.id);
    const uniqueIds = [...new Set(frontendIds)];
    
    if (frontendIds.length !== uniqueIds.length) {
      console.log(`❌ DUPLICATE IDs FOUND: ${frontendIds.length} mapped workers but only ${uniqueIds.length} unique IDs`);
      
      // Find duplicates
      const duplicates = frontendIds.filter((id, index) => frontendIds.indexOf(id) !== index);
      console.log('   Duplicate IDs:', [...new Set(duplicates)]);
    } else {
      console.log(`✅ No duplicate frontend IDs found`);
    }
    
  } catch (error) {
    console.error('❌ Error during debug:', error.message);
    if (error.response) {
      console.error('   Response status:', error.response.status);
      console.error('   Response data:', error.response.data);
    }
  }
}

debugWorkerCount();
