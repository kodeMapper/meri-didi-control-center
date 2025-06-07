/**
 * Debug Frontend Save Changes Flow
 * This script replicates the exact frontend flow to identify where it breaks
 */

const axios = require('axios');

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Replicate frontend ID mapping logic
let workerIdMap = new Map();
let backendIdMap = new Map();

function initializeKnownWorkerMappings() {
  const stringFrontendId = "string_2345678";
  workerIdMap.set('2345678', stringFrontendId);
  backendIdMap.set(stringFrontendId, '1');
  backendIdMap.set('2345678', '1');
  
  const yadhnikaFrontendId = "yadhnika_9620393109";
  workerIdMap.set('9620393109', yadhnikaFrontendId);
  backendIdMap.set(yadhnikaFrontendId, '2');
  backendIdMap.set('9620393109', '2');
  
  const tabtabidamFrontendId = "tabtabidam_456123789";  
  workerIdMap.set('456123789', tabtabidamFrontendId);
  backendIdMap.set(tabtabidamFrontendId, '3');
  backendIdMap.set('456123789', '3');
  
  console.log("🗺️ Known worker mappings initialized");
}

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

async function findAndCacheBackendId(frontendId) {
  try {
    console.log(`🔍 ID RESOLVER: Looking for backend ID for frontend ID: ${frontendId}`);
    
    // Special case for String worker (ID 1)
    if (frontendId.toLowerCase().includes('string')) {
      console.log('🔍 ID RESOLVER: Special case: String worker detected, using backend ID 1');
      backendIdMap.set(frontendId, '1');
      return '1';
    }
    
    // Special case for Yadhnika (ID 2)
    if (frontendId.toLowerCase().includes('yadhnika')) {
      console.log('🔍 ID RESOLVER: Special case: Yadhnika detected, using backend ID 2');
      backendIdMap.set(frontendId, '2');
      return '2';
    }
    
    // Special case for Tabtabidam (ID 3)
    if (frontendId.toLowerCase().includes('tabtabidam')) {
      console.log('🔍 ID RESOLVER: Special case: Tabtabidam detected, using backend ID 3');
      backendIdMap.set(frontendId, '3');
      return '3';
    }
    
    // If we already have it cached, return it
    if (backendIdMap.has(frontendId)) {
      const cachedId = backendIdMap.get(frontendId);
      console.log(`🔍 ID RESOLVER: Found cached backend ID: ${cachedId}`);
      return cachedId;
    }
    
    // Fetch all workers to find the correct backend index
    const response = await axios.get(`${API_BASE_URL}/all`);
    
    if (response.data && Array.isArray(response.data)) {
      console.log(`🔍 Retrieved ${response.data.length} workers from API`);
      
      // First try to find by direct backend ID
      const workerById = response.data.find((worker) => worker.id?.toString() === frontendId);
      if (workerById) {
        console.log(`🔍 Found exact match by ID: ${workerById.name} (ID: ${workerById.id})`);
        return workerById.id.toString();
      }
      
      // Check if the frontend ID contains a name part that matches any worker
      const namePart = frontendId.split('_')[0];
      if (namePart) {
        const workerByName = response.data.find((worker) => {
          const workerName = worker.name?.toLowerCase().replace(/\s+/g, '_') || '';
          return workerName.includes(namePart) || namePart.includes(workerName);
        });
        
        if (workerByName) {
          console.log(`🔍 Found worker by name part: ${workerByName.name} (ID: ${workerByName.id})`);
          const backendId = workerByName.id?.toString();
          if (backendId) {
            backendIdMap.set(frontendId, backendId);
            return backendId;
          }
        }
      }
      
      console.log(`🔍 No match found for frontend ID: ${frontendId}`);
      return null;
    }
    
    console.log('🔍 No valid worker data received from API');
    return null;
    
  } catch (error) {
    console.error('🔍 Error in findAndCacheBackendId:', error.message);
    return null;
  }
}

// Replicate the updateWorkerProfile function
async function updateWorkerProfile(workerId, updateData, currentWorker) {
  try {
    console.log("🔵 API SERVICE: updateWorkerProfile called");
    console.log("🔵 API SERVICE: workerId parameter:", workerId);
    console.log("🔵 API SERVICE: updateData:", JSON.stringify(updateData, null, 2));
    console.log("🔵 API SERVICE: currentWorker:", currentWorker ? currentWorker.fullName : 'null');
    
    const backendId = await findAndCacheBackendId(workerId);
    
    if (!backendId) {
      console.error("🚨 API SERVICE: Could not resolve backend ID for worker:", workerId);
      return false;
    }
    
    console.log("🔵 API SERVICE: Resolved backend ID:", backendId);
    
    // Map frontend fields to backend fields
    const mappedData = {
      status: updateData.status,
      religion: updateData.religion,
      phone: updateData.phone,
      email: updateData.email,
      address: updateData.address,
      service: updateData.service, // Frontend uses 'service', backend expects 'service'
      availability: updateData.availability
    };
    
    console.log("🌐 API CALL: Making PUT request to backend");
    console.log("🌐 API CALL: URL:", `${API_BASE_URL}/update/${backendId}`);
    console.log("🌐 API CALL: Payload:", JSON.stringify(mappedData, null, 2));
    
    const response = await axios.put(`${API_BASE_URL}/update/${backendId}`, mappedData, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log("✅ API CALL: Response received");
    console.log("✅ API CALL: Status:", response.status);
    console.log("✅ API CALL: Data:", JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      console.log("🎉 API SERVICE: Worker profile updated successfully");
      return true;
    } else {
      console.error("❌ API SERVICE: Unexpected response status:", response.status);
      return false;
    }
    
  } catch (error) {
    console.error("❌ API SERVICE: Error in updateWorkerProfile:", error.message);
    if (error.response) {
      console.error("❌ API SERVICE: Response status:", error.response.status);
      console.error("❌ API SERVICE: Response data:", error.response.data);
    }
    return false;
  }
}

// Main debug function
async function debugFrontendFlow() {
    console.log('🐛 DEBUGGING FRONTEND SAVE CHANGES FLOW\n');
    console.log('=' * 60);
    
    try {
        // Initialize mappings
        initializeKnownWorkerMappings();
        
        // Step 1: Simulate getAllWorkers (what EditWorkerPage does on load)
        console.log('\n📋 STEP 1: Simulating EditWorkerPage getAllWorkers...');
        const allWorkersResponse = await axios.get(`${API_BASE_URL}/all`);
        const allWorkers = allWorkersResponse.data;
        
        // Transform to frontend format
        const frontendWorkers = allWorkers.map((worker, index) => ({
            id: getFrontendWorkerId(worker, index),
            fullName: worker.name,
            email: worker.email,
            phone: worker.phone,
            address: worker.address,
            serviceType: worker.service,
            availability: worker.availability,
            status: worker.status,
            religion: worker.religion,
            backendId: worker.id
        }));
        
        console.log(`📋 Retrieved ${frontendWorkers.length} workers`);
        frontendWorkers.forEach(worker => {
            console.log(`   📋 ${worker.fullName}: Frontend ID = ${worker.id}, Backend ID = ${worker.backendId}`);
        });
        
        // Step 2: Find Yadhnika worker (simulate what EditWorkerPage does)
        console.log('\n🎯 STEP 2: Finding Yadhnika worker...');
        const yadhnikaWorker = frontendWorkers.find(w => w.fullName === 'Yadhnika');
        
        if (!yadhnikaWorker) {
            throw new Error('Yadhnika worker not found');
        }
        
        console.log('🎯 Found Yadhnika:');
        console.log(`   🎯 Frontend ID: ${yadhnikaWorker.id}`);
        console.log(`   🎯 Backend ID: ${yadhnikaWorker.backendId}`);
        console.log(`   🎯 Current Email: ${yadhnikaWorker.email}`);
        
        // Step 3: Simulate user editing data (what happens in EditWorkerPage form)
        console.log('\n📝 STEP 3: Simulating user editing email...');
        const originalEmail = yadhnikaWorker.email;
        const newEmail = `yadhnika.debug${Date.now()}@example.com`;
        
        const editableData = {
            phone: yadhnikaWorker.phone || '',
            email: newEmail,  // User changed this
            address: yadhnikaWorker.address || '',
            service: yadhnikaWorker.serviceType || 'Cleaning',
            availability: yadhnikaWorker.availability || 'Full-Time',
            status: yadhnikaWorker.status || 'Pending',
            religion: yadhnikaWorker.religion || 'Hindu'
        };
        
        console.log(`📝 User changes email from "${originalEmail}" to "${newEmail}"`);
        console.log('📝 Complete editable data:', JSON.stringify(editableData, null, 2));
        
        // Step 4: Simulate handleSaveChanges -> handleUpdateWorkerProfile
        console.log('\n💾 STEP 4: Simulating handleSaveChanges...');
        console.log("💾 FRONTEND: User clicked Save Changes");
        console.log("💾 FRONTEND: Current worker:", yadhnikaWorker.fullName);
        console.log("💾 FRONTEND: Worker ID for API call:", yadhnikaWorker.id);
        
        // Step 5: Call updateWorkerProfile (the core of the issue)
        console.log('\n🔄 STEP 5: Calling updateWorkerProfile...');
        const success = await updateWorkerProfile(yadhnikaWorker.id, editableData, yadhnikaWorker);
        
        if (success) {
            console.log("✅ FRONTEND: updateWorkerProfile returned success");
            
            // Step 6: Verify the change was persisted
            console.log('\n🔍 STEP 6: Verifying change was persisted...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const verifyResponse = await axios.get(`${API_BASE_URL}/all`);
            const updatedWorkers = verifyResponse.data;
            const updatedYadhnika = updatedWorkers.find(w => w.id === yadhnikaWorker.backendId);
            
            if (updatedYadhnika && updatedYadhnika.email === newEmail) {
                console.log('🎉 SUCCESS: Email was successfully updated in backend!');
                console.log(`🎉 Email changed from "${originalEmail}" to "${updatedYadhnika.email}"`);
                return true;
            } else {
                console.log('❌ FAILURE: Email was NOT updated in backend');
                console.log(`❌ Expected: "${newEmail}"`);
                console.log(`❌ Actual: "${updatedYadhnika ? updatedYadhnika.email : 'worker not found'}"`);
                return false;
            }
        } else {
            console.log("❌ FRONTEND: updateWorkerProfile returned false");
            return false;
        }
        
    } catch (error) {
        console.error('❌ Fatal error in debugFrontendFlow:', error.message);
        if (error.response) {
            console.error('❌ Response status:', error.response.status);
            console.error('❌ Response data:', error.response.data);
        }
        return false;
    }
}

// Run the debug
debugFrontendFlow()
    .then(success => {
        console.log('\n' + '='.repeat(60));
        console.log(success ? '🎉 FRONTEND FLOW WORKS CORRECTLY' : '❌ ISSUE FOUND IN FRONTEND FLOW');
        console.log('='.repeat(60));
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
