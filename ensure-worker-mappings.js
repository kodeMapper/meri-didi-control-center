// ensure-worker-mappings.js
// This utility script ensures that all critical worker mappings are correct
// and workers have the proper status
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

function warningLog(title, message) {
  log(title, message, colors.yellow);
}

// Critical worker mappings based on verification
const CRITICAL_WORKERS = {
  1: {
    name: 'string',
    expectedStatus: 'Active'
  },
  2: {
    name: 'Yadhnika',
    expectedStatus: 'Active'
  },
  3: {
    name: 'Tabtabidam',
    expectedStatus: 'Active'
  }
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
async function updateWorkerStatus(workerId, newStatus, workerData) {
  try {
    log('UPDATE', `Setting worker ${workerId} (${workerData.name}) status to ${newStatus}...`);
    
    // Prepare update payload with required fields
    const updateData = {
      status: newStatus,
      religion: workerData.religion || 'Hindu',
      phone: workerData.phone || '',
      email: workerData.email || '',
      address: workerData.address || '',
      service: workerData.service || 'Cleaning',
      availability: workerData.availability || 'Full-Time'
    };
    
    const response = await axios.put(`${API_BASE_URL}/update/${workerId}`, updateData);
    
    if (response.status === 200) {
      successLog('SUCCESS', `Worker ${workerId} (${workerData.name}) status changed to ${newStatus}`);
      return true;
    } else {
      throw new Error(`Received status code ${response.status}`);
    }
  } catch (error) {
    errorLog('ERROR', `Failed to update worker ${workerId} status: ${error.message}`);
    return false;
  }
}

// Main function to ensure worker mappings and statuses
async function ensureWorkerMappings() {
  log('START', 'Ensuring critical worker mappings and statuses...', colors.magenta);
  
  try {
    // Step 1: Get all workers
    const workers = await getAllWorkers();
    
    if (workers.length === 0) {
      throw new Error('Could not retrieve any workers from API');
    }
    
    log('FETCH', `Found ${workers.length} workers in total`, colors.blue);
    
    // Step 2: Verify and fix critical worker mappings
    const criticalIds = Object.keys(CRITICAL_WORKERS).map(id => parseInt(id));
    
    for (const id of criticalIds) {
      const worker = workers.find(w => w.id === id);
      const expected = CRITICAL_WORKERS[id];
      
      if (!worker) {
        errorLog('MISSING', `Critical worker ID ${id} (${expected.name}) not found in backend!`);
        continue;
      }
      
      // Verify worker name
      if (worker.name.toLowerCase() === expected.name.toLowerCase()) {
        successLog('MATCH', `Worker ID ${id} correctly maps to ${worker.name}`);
      } else {
        warningLog('MISMATCH', `Worker ID ${id} maps to "${worker.name}" instead of "${expected.name}"`);
      }
      
      // Verify and fix worker status if needed
      if (worker.status === expected.expectedStatus) {
        successLog('STATUS', `Worker ID ${id} (${worker.name}) already has correct status: ${worker.status}`);
      } else {
        warningLog('STATUS', `Worker ID ${id} (${worker.name}) has status "${worker.status}" instead of "${expected.expectedStatus}"`);
        
        // Fix the status
        await updateWorkerStatus(id, expected.expectedStatus, worker);
      }
    }
    
    // Step 3: Final verification
    const updatedWorkers = await getAllWorkers();
    
    log('SUMMARY', 'Final worker statuses:', colors.blue);
    
    let allCorrect = true;
    for (const id of criticalIds) {
      const worker = updatedWorkers.find(w => w.id === id);
      const expected = CRITICAL_WORKERS[id];
      
      if (!worker) {
        errorLog('ERROR', `Worker ID ${id} (${expected.name}) not found in final verification`);
        allCorrect = false;
        continue;
      }
      
      const nameCorrect = worker.name.toLowerCase() === expected.name.toLowerCase();
      const statusCorrect = worker.status === expected.expectedStatus;
      
      if (nameCorrect && statusCorrect) {
        log('VERIFY', `ID ${id}: ${worker.name} - Status: ${worker.status} ✓`, colors.green);
      } else {
        log('VERIFY', `ID ${id}: ${worker.name} - Status: ${worker.status} ✗`, colors.red);
        allCorrect = false;
      }
    }
    
    if (allCorrect) {
      successLog('COMPLETE', 'All critical worker mappings and statuses are correct!', colors.magenta);
      return true;
    } else {
      errorLog('INCOMPLETE', 'Not all critical worker mappings or statuses could be fixed', colors.magenta);
      return false;
    }
  } catch (error) {
    errorLog('ERROR', `Failed to ensure worker mappings: ${error.message}`);
    return false;
  }
}

// Run the function
ensureWorkerMappings().then(success => {
  if (success) {
    console.log('\n✅ All critical worker mappings and statuses have been verified and fixed!');
  } else {
    console.log('\n⚠️ Some issues with worker mappings or statuses could not be fixed.');
    console.log('Please check the logs above for details and consider manual intervention.');
  }
});
