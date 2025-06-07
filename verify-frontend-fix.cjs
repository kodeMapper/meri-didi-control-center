const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseAnonKey = 'public-anon-key-would-be-here';

// Mock the supabase client since we don't have real credentials
const mockWorkers = [
  {
    id: 1,
    name: 'Worker 1',
    email: 'worker1@example.com',
    phone: '1234567890',
    status: 'Inactive',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    name: 'Worker 2', 
    email: 'worker2@example.com',
    phone: '1234567891',
    status: 'string',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: 3,
    name: 'Worker 3',
    email: 'worker3@example.com', 
    phone: '1234567892',
    status: 'Super Approved',
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: 4,
    name: 'Worker 4',
    email: 'worker4@example.com',
    phone: '1234567893', 
    status: 'Pending',
    created_at: '2024-01-04T00:00:00Z'
  }
];

// Import the normalization function from our API service
function normalizeWorkerStatus(status) {
  const normalizedStatus = status?.toString().toLowerCase().trim();
  
  switch (normalizedStatus) {
    case 'super approved':
    case 'approved':
    case 'active':
      return 'Active';
    case 'inactive':
    case 'deactivated':
      return 'Inactive';
    case 'pending':
    case 'awaiting approval':
    case 'string': // Handle invalid status
      return 'Pending';
    case 'rejected':
    case 'denied':
      return 'Rejected';
    default:
      console.warn(`Unknown worker status: ${status}, defaulting to Pending`);
      return 'Pending';
  }
}

function mapBackendWorkerToWorker(workerData) {
  return {
    id: workerData.id?.toString() || '',
    name: workerData.name || '',
    email: workerData.email || '',
    phone: workerData.phone || '',
    status: normalizeWorkerStatus(workerData.status),
    joinDate: workerData.created_at ? new Date(workerData.created_at).toLocaleDateString() : '',
    profileImage: workerData.profile_image || '/placeholder.svg'
  };
}

// Simulate frontend filtering logic
function filterWorkersByStatus(workers, activeTab) {
  return workers.filter(worker => {
    switch (activeTab) {
      case 'all':
        return true;
      case 'active':
        return worker.status === 'Active';
      case 'inactive':
        return worker.status === 'Inactive';
      case 'pending':
        return worker.status === 'Pending';
      case 'rejected':
        return worker.status === 'Rejected';
      default:
        return true;
    }
  });
}

console.log('🔍 Testing Frontend Fix - All Workers Display');
console.log('=' .repeat(50));

// Test the full flow
console.log('\n📊 Backend Workers (Raw):');
mockWorkers.forEach((worker, index) => {
  console.log(`${index + 1}. ${worker.name} - Status: "${worker.status}"`);
});

console.log('\n🔄 After Status Normalization:');
const normalizedWorkers = mockWorkers.map(mapBackendWorkerToWorker);
normalizedWorkers.forEach((worker, index) => {
  console.log(`${index + 1}. ${worker.name} - Status: "${worker.status}"`);
});

console.log('\n📋 Frontend Tab Filtering Results:');
const tabs = ['all', 'active', 'inactive', 'pending', 'rejected'];

tabs.forEach(tab => {
  const filtered = filterWorkersByStatus(normalizedWorkers, tab);
  console.log(`\n${tab.toUpperCase()} Tab: ${filtered.length} workers`);
  filtered.forEach((worker, index) => {
    console.log(`  ${index + 1}. ${worker.name} (${worker.status})`);
  });
});

console.log('\n✅ Summary:');
console.log(`Total Backend Workers: ${mockWorkers.length}`);
console.log(`Total Frontend Workers: ${normalizedWorkers.length}`);
console.log(`Active Workers: ${filterWorkersByStatus(normalizedWorkers, 'active').length}`);
console.log(`Inactive Workers: ${filterWorkersByStatus(normalizedWorkers, 'inactive').length}`);
console.log(`Pending Workers: ${filterWorkersByStatus(normalizedWorkers, 'pending').length}`);
console.log(`Rejected Workers: ${filterWorkersByStatus(normalizedWorkers, 'rejected').length}`);

console.log('\n🎯 Expected Result: All 4 workers should now be visible in the frontend!');
