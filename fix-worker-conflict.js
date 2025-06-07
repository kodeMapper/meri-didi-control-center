// Fixed Worker ID Conflict Resolution Script
// This script specifically fixes the ID conflict between Yadhnika and string workers
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

// Known worker mappings - Corrected based on verification
// IMPORTANT: The backend has these workers mapped differently than expected
const workerMappings = {
  // Based on verification, worker ID 1 is actually "string"
  string: {
    id: 1,
    name: 'string',
    expectedPhone: '2345678'
  },
  // Based on verification, worker ID 3 is "Tabtabidam"
  tabtabidam: {
    id: 3,
    name: 'Tabtabidam',
    expectedPhone: ''
  },
  // Yadhnika needs to be found by name
  yadhnika: {
    id: null, // Will be determined dynamically
    name: 'Yadhnika',
    expectedPhone: '9620393109'
  }
};

async function getWorkerById(id) {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    if (response.data && Array.isArray(response.data)) {
      const worker = response.data.find(w => w.id === id);
      return worker || null;
    }
    return null;
  } catch (error) {
    errorLog('API', `Error retrieving worker: ${error.message}`);
    return null;
  }
}

async function updateWorkerStatus(id, status, workerData) {
  try {
    log('UPDATE', `Setting worker ${id} (${workerData.name}) status to ${status}`);
    
    const updateData = {
      status,
      religion: workerData.religion || 'Hindu',
      phone: workerData.phone || '',
      email: workerData.email || '',
      address: workerData.address || '',
      service: workerData.service || 'Cleaning',
      availability: workerData.availability || 'Full-Time'
    };
    
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, updateData);
    
    if (response.status === 200) {
      successLog('SUCCESS', `Worker ${id} (${workerData.name}) status updated to ${status}`);
      return true;
    } else {
      errorLog('ERROR', `Failed to update worker ${id} status: ${response.status}`);
      return false;
    }
  } catch (error) {
    errorLog('ERROR', `Error updating worker ${id} status: ${error.message}`);
    return false;
  }
}

async function getAllWorkers() {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`);
    if (response.data && Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    errorLog('API', `Error retrieving all workers: ${error.message}`);
    return [];
  }
}

async function fixWorkerConflict() {
  log('START', 'Beginning worker ID conflict resolution', colors.magenta);
  
  try {
    // Step 1: Get all workers data
    log('FETCH', 'Getting all workers data...');
    
    const allWorkers = await getAllWorkers();
    if (allWorkers.length === 0) {
      errorLog('ERROR', 'Failed to retrieve workers from API');
      return false;
    }
    
    // Log all workers for debug
    log('DEBUG', `Found ${allWorkers.length} workers in total`);
    allWorkers.forEach(worker => {
      console.log(`  ID ${worker.id}: ${worker.name} - Status: ${worker.status}, Phone: ${worker.phone || 'N/A'}`);
    });
    
    // Step 2: Find the workers based on our corrected mappings
    const stringWorker = allWorkers.find(w => w.id === workerMappings.string.id);
    const tabtabidamWorker = allWorkers.find(w => w.id === workerMappings.tabtabidam.id);
    const yadhnikaWorker = allWorkers.find(w => 
      w.name && w.name.toLowerCase().includes('yadhnika') || 
      (w.phone && w.phone.includes(workerMappings.yadhnika.expectedPhone))
    );
    
    // Log what we found
    if (stringWorker) {
      successLog('FOUND', `String worker: ID ${stringWorker.id}, Name: ${stringWorker.name}, Status: ${stringWorker.status}`);
    } else {
      errorLog('ERROR', 'Could not find string worker');
      return false;
    }
    
    if (tabtabidamWorker) {
      successLog('FOUND', `Tabtabidam worker: ID ${tabtabidamWorker.id}, Name: ${tabtabidamWorker.name}, Status: ${tabtabidamWorker.status}`);
    } else {
      errorLog('ERROR', 'Could not find Tabtabidam worker');
      return false;
    }
    
    if (yadhnikaWorker) {
      successLog('FOUND', `Yadhnika worker: ID ${yadhnikaWorker.id}, Name: ${yadhnikaWorker.name}, Status: ${yadhnikaWorker.status}`);
      // Update the ID in our mapping
      workerMappings.yadhnika.id = yadhnikaWorker.id;
    } else {
      errorLog('ERROR', 'Could not find Yadhnika worker by name or phone');
      return false;
    }
    
    // Step 3: Ensure workers have correct status (Active)
    let updateSuccessful = true;
    
    if (stringWorker.status !== 'Active') {
      log('UPDATE', 'Setting string worker to Active status');
      updateSuccessful = await updateWorkerStatus(stringWorker.id, 'Active', stringWorker) && updateSuccessful;
    }
    
    if (yadhnikaWorker.status !== 'Active') {
      log('UPDATE', 'Setting Yadhnika worker to Active status');
      updateSuccessful = await updateWorkerStatus(yadhnikaWorker.id, 'Active', yadhnikaWorker) && updateSuccessful;
    }
    
    // Step 4: Verify the fix
    const updatedWorkers = await getAllWorkers();
    const updatedString = updatedWorkers.find(w => w.id === workerMappings.string.id);
    const updatedYadhnika = updatedWorkers.find(w => w.id === workerMappings.yadhnika.id);
    
    successLog('VERIFY', `String: ID ${updatedString.id}, Status: ${updatedString.status}`);
    successLog('VERIFY', `Yadhnika: ID ${updatedYadhnika.id}, Status: ${updatedYadhnika.status}`);
    
    // Log critical ID mappings for app configuration
    log('MAPPING', 'Critical ID mappings for configuration:', colors.magenta);
    console.log(JSON.stringify({
      string: updatedString.id,
      string_name: updatedString.name,
      yadhnika: updatedYadhnika.id,
      yadhnika_name: updatedYadhnika.name,
      tabtabidam: tabtabidamWorker.id,
      tabtabidam_name: tabtabidamWorker.name
    }, null, 2));
    
    if (updatedYadhnika.status === 'Active' && updatedString.status === 'Active') {
      successLog('COMPLETE', 'Worker ID conflict resolution successful!', colors.magenta);
      return true;
    } else {
      errorLog('INCOMPLETE', 'Worker status verification failed');
      return false;
    }
  } catch (error) {
    errorLog('ERROR', `Worker ID conflict resolution failed: ${error.message}`);
    return false;
  }
}

// Run the fix script
fixWorkerConflict().then(success => {
  if (success) {
    console.log('\n✅ Worker ID conflict has been resolved successfully!');
    console.log('✅ Both Yadhnika and string workers are now Active.');
  } else {
    console.log('\n❌ Worker ID conflict resolution was not fully successful.');
    console.log('Please check the logs above for details.');
  }
});
