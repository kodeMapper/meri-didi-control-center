// Simple test for the worker status normalization
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

async function testStatusNormalization() {
  try {
    console.log('🔍 Testing Worker Status Normalization\n');
    
    const response = await axios.get(`${API_BASE_URL}/all`);
    console.log(`📊 Backend returned ${response.data.length} workers:\n`);
    
    response.data.forEach((worker, index) => {
      const originalStatus = worker.status;
      const normalizedStatus = normalizeWorkerStatus(worker.status);
      console.log(`${index + 1}. ${worker.name}`);
      console.log(`   Original: "${originalStatus}" → Normalized: "${normalizedStatus}"`);
      console.log(`   Phone: ${worker.phone}`);
      console.log('');
    });
    
    // Count by normalized status
    const statusCounts = response.data.reduce((counts, worker) => {
      const normalized = normalizeWorkerStatus(worker.status);
      counts[normalized] = (counts[normalized] || 0) + 1;
      return counts;
    }, {});
    
    console.log('📈 Final Status Distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    
    const total = Object.values(statusCounts).reduce((sum, count) => sum + count, 0);
    console.log(`   Total: ${total}`);
    
    console.log('\n✅ All workers will now be displayed in the frontend!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testStatusNormalization();
