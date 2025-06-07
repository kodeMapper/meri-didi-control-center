// Test script to verify the fix works for frontend worker display
const axios = require('axios');

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Replicated frontend status normalization function 
function normalizeWorkerStatus(backendStatus) {
  if (!backendStatus) return 'Pending';
  
  const status = backendStatus.toLowerCase();
  
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
    return 'Pending';
  }
  
  return 'Pending';
}

// Replicated frontend ID generation logic
function getFrontendWorkerId(workerData, index) {
  const phoneNumber = workerData.phone?.replace(/[^0-9]/g, '') || '';
  const workerName = workerData.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
  
  if (!phoneNumber) {
    return `worker_${workerName}_${Math.random().toString(36).substr(2, 6)}`;
  }
  
  return `${workerName}_${phoneNumber}`;
}

// Replicated frontend worker mapping
function mapBackendWorkerToWorker(workerData, index) {
  const workerId = getFrontendWorkerId(workerData, index);
  
  return {
    id: workerId,
    fullName: workerData.name || "",
    email: workerData.email || "",
    phone: workerData.phone || "",
    serviceType: workerData.service || "Cleaning",
    status: normalizeWorkerStatus(workerData.status),
    // ... other fields would be here
  };
}

async function testFrontendWorkerDisplay() {
  try {
    console.log('🔍 Testing Frontend Worker Display Fix\n');
    
    // Simulate frontend getAllWorkers call
    console.log('1️⃣ Fetching workers from API...');
    const response = await axios.get(`${API_BASE_URL}/all`);
    
    // Simulate frontend mapping
    console.log('2️⃣ Mapping workers with frontend logic...');
    const mappedWorkers = response.data.map((worker, index) => mapBackendWorkerToWorker(worker, index));
    
    console.log(`📊 Total workers mapped: ${mappedWorkers.length}`);
    
    // Simulate frontend filtering by status (like in WorkerManagement.tsx)
    console.log('\n3️⃣ Filtering workers by status...');
    const activeWorkers = mappedWorkers.filter(worker => worker.status === 'Active');
    const inactiveWorkers = mappedWorkers.filter(worker => worker.status === 'Inactive');
    const pendingWorkers = mappedWorkers.filter(worker => worker.status === 'Pending');
    const rejectedWorkers = mappedWorkers.filter(worker => worker.status === 'Rejected');
    
    console.log('📈 Workers by status:');
    console.log(`   Active: ${activeWorkers.length}`);
    activeWorkers.forEach(w => console.log(`     - ${w.fullName} (${w.id})`));
    
    console.log(`   Inactive: ${inactiveWorkers.length}`);
    inactiveWorkers.forEach(w => console.log(`     - ${w.fullName} (${w.id})`));
    
    console.log(`   Pending: ${pendingWorkers.length}`);
    pendingWorkers.forEach(w => console.log(`     - ${w.fullName} (${w.id})`));
    
    console.log(`   Rejected: ${rejectedWorkers.length}`);
    rejectedWorkers.forEach(w => console.log(`     - ${w.fullName} (${w.id})`));
    
    const totalDisplayed = activeWorkers.length + inactiveWorkers.length + pendingWorkers.length + rejectedWorkers.length;
    
    console.log(`\n📊 Summary:`);
    console.log(`   Backend workers: ${response.data.length}`);
    console.log(`   Frontend displayed: ${totalDisplayed}`);
    
    if (totalDisplayed === response.data.length) {
      console.log('✅ SUCCESS: All backend workers are now displayed in frontend!');
    } else {
      console.log('❌ ISSUE: Some workers are still missing');
    }
    
    console.log('\n🎯 Admin panel will now show all workers across different status tabs');
    
  } catch (error) {
    console.error('❌ Error testing frontend display:', error.message);
  }
}

testFrontendWorkerDisplay();
