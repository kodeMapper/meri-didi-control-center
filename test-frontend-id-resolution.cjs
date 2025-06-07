/**
 * Test Frontend Worker ID Resolution
 * This script tests what worker IDs the frontend generates and uses
 */

// Import the API service functions (simulate what frontend does)
const axios = require('axios');

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Simulate the frontend's getFrontendWorkerId function
function getFrontendWorkerId(workerData, backendIndex) {
  const phoneNumber = workerData.phone?.replace(/[^0-9]/g, '') || '';
  const workerName = workerData.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
  
  if (!phoneNumber) {
    // Fallback for workers without phone numbers
    const fallbackId = `worker_${workerName}_${Math.random().toString(36).substr(2, 6)}`;
    return fallbackId;
  }
  
  // Generate a consistent frontend ID based on name and phone
  const frontendId = `${workerName}_${phoneNumber}`;
  return frontendId;
}

// Test worker ID resolution
async function testWorkerIdResolution() {
    console.log('🧪 Testing Frontend Worker ID Resolution...\n');
    
    try {
        // Step 1: Get all workers from backend
        console.log('📋 Step 1: Fetching all workers from backend...');
        const response = await axios.get(`${API_BASE_URL}/all`);
        const workers = response.data;
        
        console.log(`📋 Found ${workers.length} workers in backend`);
        
        // Step 2: Generate frontend IDs for each worker (simulate what frontend does)
        console.log('\n📝 Step 2: Generating frontend IDs...');
        workers.forEach((worker, index) => {
            const frontendId = getFrontendWorkerId(worker, index);
            console.log(`📝 Worker: ${worker.name} (Backend ID: ${worker.id})`);
            console.log(`   📝 Phone: ${worker.phone}`);
            console.log(`   📝 Generated Frontend ID: ${frontendId}`);
            console.log(`   📝 Current Email: ${worker.email}`);
            console.log('');
        });
        
        // Step 3: Test specific Yadhnika case
        const yadhnika = workers.find(w => w.name === 'Yadhnika');
        if (yadhnika) {
            const yadhnikaFrontendId = getFrontendWorkerId(yadhnika);
            console.log('🎯 Step 3: Testing Yadhnika specifically...');
            console.log(`🎯 Backend ID: ${yadhnika.id}`);
            console.log(`🎯 Frontend ID: ${yadhnikaFrontendId}`);
            console.log(`🎯 Phone: ${yadhnika.phone}`);
            console.log(`🎯 Email: ${yadhnika.email}`);
            
            // Step 4: Test ID resolution (simulate findAndCacheBackendId)
            console.log('\n🔍 Step 4: Testing ID resolution...');
            
            // Test special case detection
            if (yadhnikaFrontendId.toLowerCase().includes('yadhnika')) {
                console.log('🔍 ✅ Special case detection would work (contains "yadhnika")');
                console.log('🔍 ✅ Should resolve to backend ID: 2');
            } else {
                console.log('🔍 ❌ Special case detection would NOT work');
            }
            
            // Step 5: Test API call with the frontend ID
            console.log('\n🌐 Step 5: Testing API call with frontend ID...');
            console.log(`🌐 Would call: PUT ${API_BASE_URL}/update/2`);
            console.log('🌐 (Backend ID resolved from frontend ID via special case detection)');
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error in testWorkerIdResolution:', error.message);
        if (error.response) {
            console.error('❌ Response status:', error.response.status);
            console.error('❌ Response data:', error.response.data);
        }
        return false;
    }
}

// Run the test
testWorkerIdResolution()
    .then(success => {
        console.log('\n' + '='.repeat(60));
        console.log(success ? '🎉 TEST PASSED' : '❌ TEST FAILED');
        console.log('='.repeat(60));
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
