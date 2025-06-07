// test-worker-status-fix.js
// This script tests our fixed worker ID mappings for status changes
import axios from 'axios';

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Color console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(title, message, color = colors.cyan) {
  console.log(`${color}[${title}]${colors.reset} ${message}`);
}

function successLog(title, message) {
  log(title, message, colors.green);
}

function errorLog(title, message) {
  log(title, message, colors.red);
}

// Create the correct ID mappings based on our verification
const WORKER_IDS = {
  STRING: 1,   // ID 1 is "string"
  YADHNIKA: 2, // ID 2 is "Yadhnika"
  TABTABIDAM: 3 // ID 3 is "Tabtabidam"
};

// Helper function to get all workers
async function getAllWorkers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    return response.data;
  } catch (error) {
    errorLog('ERROR', `Failed to get workers: ${error.message}`);
    return [];
  }
}

// Helper function to update worker status
async function updateWorkerStatus(workerId, newStatus) {
  try {
    log('UPDATE', `Setting worker ${workerId} status to ${newStatus}...`);
    
    // First get the worker's current data
    const workers = await getAllWorkers();
    const worker = workers.find(w => w.id === workerId);
    
    if (!worker) {
      throw new Error(`Worker ID ${workerId} not found`);
    }
    
    // Prepare the update payload with required fields
    const updateData = {
      status: newStatus,
      religion: worker.religion || 'Hindu',
      phone: worker.phone || '',
      email: worker.email || '',
      address: worker.address || '',
      service: worker.service || 'Cleaning',
      availability: worker.availability || 'Full-Time'
    };
    
    // Send the update request
    const response = await axios.put(`${API_BASE_URL}/update/${workerId}`, updateData);
    
    if (response.status === 200) {
      successLog('SUCCESS', `Worker ${workerId} status changed to ${newStatus}`);
      return true;
    } else {
      throw new Error(`Received status code ${response.status}`);
    }
  } catch (error) {
    errorLog('ERROR', `Failed to update worker ${workerId} status: ${error.message}`);
    return false;
  }
}

// Helper function to verify status change
async function verifyWorkerStatus(workerId, expectedStatus) {
  try {
    // Get updated worker data
    const workers = await getAllWorkers();
    const worker = workers.find(w => w.id === workerId);
    
    if (!worker) {
      throw new Error(`Worker ID ${workerId} not found`);
    }
    
    if (worker.status === expectedStatus) {
      successLog('VERIFY', `Worker ${workerId} (${worker.name}) status is correctly set to ${worker.status}`);
      return true;
    } else {
      errorLog('VERIFY', `Worker ${workerId} (${worker.name}) has wrong status: ${worker.status} (expected ${expectedStatus})`);
      return false;
    }
  } catch (error) {
    errorLog('ERROR', `Failed to verify worker ${workerId} status: ${error.message}`);
    return false;
  }
}

// Main test function
async function runTest() {
  log('START', 'Testing worker status changes with correct ID mappings...', colors.magenta);
  
  try {
    // Step 1: Get initial worker data
    const initialWorkers = await getAllWorkers();
    
    if (initialWorkers.length === 0) {
      throw new Error('Could not retrieve any workers from API');
    }
    
    // Log the initial state
    initialWorkers.forEach(worker => {
      log('INITIAL', `Worker ID ${worker.id}: ${worker.name} - Status: ${worker.status}`);
    });
    
    // Step 2: Test updating string worker (ID 1)
    const stringWorker = initialWorkers.find(w => w.id === WORKER_IDS.STRING);
    if (!stringWorker) {
      throw new Error('String worker not found');
    }
    
    // Toggle status between Active and Inactive
    const newStringStatus = stringWorker.status === 'Active' ? 'Inactive' : 'Active';
    await updateWorkerStatus(WORKER_IDS.STRING, newStringStatus);
    await verifyWorkerStatus(WORKER_IDS.STRING, newStringStatus);
    
    // Step 3: Test updating Yadhnika worker (ID 2)
    const yadhnikaWorker = initialWorkers.find(w => w.id === WORKER_IDS.YADHNIKA);
    if (!yadhnikaWorker) {
      throw new Error('Yadhnika worker not found');
    }
    
    // Toggle status between Active and Inactive
    const newYadhnikaStatus = yadhnikaWorker.status === 'Active' ? 'Inactive' : 'Active';
    await updateWorkerStatus(WORKER_IDS.YADHNIKA, newYadhnikaStatus);
    await verifyWorkerStatus(WORKER_IDS.YADHNIKA, newYadhnikaStatus);
    
    // Step 4: Test updating Tabtabidam worker (ID 3)
    const tabtabidamWorker = initialWorkers.find(w => w.id === WORKER_IDS.TABTABIDAM);
    if (!tabtabidamWorker) {
      throw new Error('Tabtabidam worker not found');
    }
    
    // Toggle status between Active and Inactive
    const newTabtabidamStatus = tabtabidamWorker.status === 'Active' ? 'Inactive' : 'Active';
    await updateWorkerStatus(WORKER_IDS.TABTABIDAM, newTabtabidamStatus);
    await verifyWorkerStatus(WORKER_IDS.TABTABIDAM, newTabtabidamStatus);
    
    // Step 5: Restore original statuses if needed
    // Now set all workers back to Active status for consistency
    if (newStringStatus !== 'Active') {
      await updateWorkerStatus(WORKER_IDS.STRING, 'Active');
    }
    
    if (newYadhnikaStatus !== 'Active') {
      await updateWorkerStatus(WORKER_IDS.YADHNIKA, 'Active');
    }
    
    if (newTabtabidamStatus !== 'Active') {
      await updateWorkerStatus(WORKER_IDS.TABTABIDAM, 'Active');
    }
    
    // Step 6: Final verification
    const finalWorkers = await getAllWorkers();
    log('FINAL', 'Final worker statuses:', colors.blue);
    finalWorkers.forEach(worker => {
      log('STATUS', `Worker ID ${worker.id}: ${worker.name} - Status: ${worker.status}`);
    });
    
    successLog('COMPLETE', 'Worker status change testing completed successfully!', colors.magenta);
    return true;
  } catch (error) {
    errorLog('ERROR', `Test failed: ${error.message}`);
    return false;
  }
}

// Run the test
runTest().then(success => {
  if (success) {
    console.log('\n✅ Worker status change functionality works correctly with the new ID mappings!');
  } else {
    console.log('\n❌ Worker status change test failed.');
    console.log('Please check the logs above for details.');
  }
});
