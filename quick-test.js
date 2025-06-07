// Quick test with manual data
const workers = [
  { name: "Tabtabidam", status: "Inactive", phone: "456123789" },
  { name: "YadhTest", status: "string", phone: "string" },
  { name: "string", status: "Super Approved", phone: "1234567890" },
  { name: "Yadhnika", status: "Pending", phone: "string" }
];

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
  
  console.warn(`Unknown worker status "${backendStatus}" mapped to "Pending"`);
  return 'Pending';
}

console.log('🔍 Testing Status Normalization with Current Data\n');

workers.forEach((worker, index) => {
  const normalizedStatus = normalizeWorkerStatus(worker.status);
  console.log(`${index + 1}. ${worker.name}`);
  console.log(`   "${worker.status}" → "${normalizedStatus}"`);
});

// Count by status
const statusCounts = workers.reduce((counts, worker) => {
  const normalized = normalizeWorkerStatus(worker.status);
  counts[normalized] = (counts[normalized] || 0) + 1;
  return counts;
}, {});

console.log('\n📈 Status Distribution:');
Object.entries(statusCounts).forEach(([status, count]) => {
  console.log(`   ${status}: ${count}`);
});

const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
console.log(`   Total: ${total}/4 workers will be displayed`);
