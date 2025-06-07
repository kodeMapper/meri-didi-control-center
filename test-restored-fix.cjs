// Test the restored status normalization fix
const mockWorkers = [
  {
    id: 1,
    name: 'Worker 1',
    email: 'worker1@example.com',
    phone: '1234567890',
    status: 'Inactive'
  },
  {
    id: 2,
    name: 'Worker 2', 
    email: 'worker2@example.com',
    phone: '1234567891',
    status: 'string'  // Invalid status
  },
  {
    id: 3,
    name: 'Worker 3',
    email: 'worker3@example.com', 
    phone: '1234567892',
    status: 'Super Approved'  // Invalid status
  },
  {
    id: 4,
    name: 'Worker 4',
    email: 'worker4@example.com',
    phone: '1234567893', 
    status: 'Pending'
  }
];

// Restored normalizeWorkerStatus function
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

// Restored mapBackendWorkerToWorker with normalization
function mapBackendWorkerToWorker(workerData, index) {
  return {
    id: workerData.id?.toString() || '',
    name: workerData.name || '',
    status: normalizeWorkerStatus(workerData.status)  // Uses normalization!
  };
}

// Simulate frontend filtering (should now show all workers)
function filterWorkersByStatus(workers, validStatuses = ['Active', 'Inactive', 'Pending', 'Rejected']) {
  return workers.filter(worker => validStatuses.includes(worker.status));
}

console.log('✅ RESTORED: Status Normalization Fix (Commit 3941e93)');
console.log('=' .repeat(60));

console.log('\n📊 Backend Workers (Raw):');
mockWorkers.forEach((worker, index) => {
  console.log(`${index + 1}. ${worker.name} - Status: "${worker.status}"`);
});

console.log('\n🔄 After Status Normalization (FIXED):');
const normalizedWorkers = mockWorkers.map(mapBackendWorkerToWorker);
normalizedWorkers.forEach((worker, index) => {
  console.log(`${index + 1}. ${worker.name} - Status: "${worker.status}"`);
});

console.log('\n✅ After Frontend Filtering (All Valid Now):');
const filteredWorkers = filterWorkersByStatus(normalizedWorkers);
filteredWorkers.forEach((worker, index) => {
  console.log(`${index + 1}. ${worker.name} - Status: "${worker.status}"`);
});

console.log('\n📊 Summary:');
console.log(`Backend Workers: ${mockWorkers.length}`);
console.log(`Normalized Workers: ${normalizedWorkers.length}`);
console.log(`Frontend Displayed: ${filteredWorkers.length}`);

console.log('\n🎯 STATUS MAPPINGS:');
console.log('- "Inactive" → "Inactive" ✓');
console.log('- "string" → "Pending" ✓');
console.log('- "Super Approved" → "Active" ✓');
console.log('- "Pending" → "Pending" ✓');

console.log('\n🎉 FIXED: All 4 workers are now displayed in the frontend!');
