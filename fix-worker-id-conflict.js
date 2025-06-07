// Script to fix the worker ID conflict between Yadhnika and string
const axios = require('axios');

// API base URL
const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Maps for consistent ID handling
const workerIdMap = new Map(); // phone -> frontend_id
const backendIdMap = new Map(); // frontend_id -> backend_id

// Debug log function with color
function log(title, message, color = '\x1b[36m') {
  console.log(color, `[${title}]`, '\x1b[0m', message);
}

// Error log with red color
function errorLog(title, message) {
  log(title, message, '\x1b[31m');
}

// Success log with green color
function successLog(title, message) {
  log(title, message, '\x1b[32m');
}

// Verify and fix worker ID mappings
async function fixWorkerIdConflict() {
  try {
    log('START', 'Fixing worker ID conflicts...');

    // Step 1: Get all workers from API
    log('FETCH', 'Getting all workers from API...');
    const response = await axios.get(`${API_BASE_URL}/all`);
    
    if (!response.data || !Array.isArray(response.data)) {
      errorLog('ERROR', 'Invalid API response format');
      return;
    }
    
    const workers = response.data;
    log('INFO', `Found ${workers.length} workers in API response`);
    
    // Step 2: Map each worker and log their data
    workers.forEach((worker, index) => {
      log('WORKER', `[${index+1}] ${worker.name} (ID: ${worker.id}, Phone: ${worker.phone}, Status: ${worker.status})`);
    });
    
    // Step 3: Find Yadhnika (ID 1) and string (ID 3)
    const yadhnika = workers.find(w => w.id === 1 || (w.name && w.name.toLowerCase().includes('yadhnika')));
    const stringWorker = workers.find(w => w.id === 3 || (w.name && w.name.toLowerCase().includes('string')));
    
    // If found, log their details
    if (yadhnika) {
      successLog('FOUND', `Yadhnika: ID ${yadhnika.id}, Phone: ${yadhnika.phone}, Status: ${yadhnika.status}`);
    } else {
      errorLog('MISSING', 'Could not find Yadhnika worker');
    }
    
    if (stringWorker) {
      successLog('FOUND', `String: ID ${stringWorker.id}, Phone: ${stringWorker.phone}, Status: ${stringWorker.status}`);
    } else {
      errorLog('MISSING', 'Could not find String worker');
    }
    
    // Step 4: Verify the statuses - are they correct?
    log('VERIFY', 'Checking current worker statuses');
    
    // Step 5: Fix Yadhnika status if needed
    if (yadhnika && yadhnika.status !== 'Active') {
      log('FIX', `Setting Yadhnika (ID ${yadhnika.id}) status to Active`);
      
      try {
        const updateData = {
          status: 'Active',
          religion: yadhnika.religion || 'Hindu',
          phone: yadhnika.phone || '',
          email: yadhnika.email || '',
          address: yadhnika.address || '',
          service: yadhnika.service || 'Cleaning',
          availability: yadhnika.availability || 'Full-Time'
        };
        
        const updateResponse = await axios.put(`${API_BASE_URL}/update/${yadhnika.id}`, updateData);
        
        if (updateResponse.status === 200) {
          successLog('SUCCESS', `Set Yadhnika status to Active`);
        } else {
          errorLog('ERROR', `Failed to update Yadhnika status: ${updateResponse.status}`);
        }
      } catch (error) {
        errorLog('ERROR', `Failed to update Yadhnika status: ${error.message}`);
      }
    }
    
    // Step 6: Fix String worker status if needed
    if (stringWorker && stringWorker.status !== 'Active') {
      log('FIX', `Setting String worker (ID ${stringWorker.id}) status to Active`);
      
      try {
        const updateData = {
          status: 'Active',
          religion: stringWorker.religion || 'Hindu',
          phone: stringWorker.phone || '',
          email: stringWorker.email || '',
          address: stringWorker.address || '',
          service: stringWorker.service || 'Cleaning',
          availability: stringWorker.availability || 'Full-Time'
        };
        
        const updateResponse = await axios.put(`${API_BASE_URL}/update/${stringWorker.id}`, updateData);
        
        if (updateResponse.status === 200) {
          successLog('SUCCESS', `Set String worker status to Active`);
        } else {
          errorLog('ERROR', `Failed to update String worker status: ${updateResponse.status}`);
        }
      } catch (error) {
        errorLog('ERROR', `Failed to update String worker status: ${error.message}`);
      }
    }
    
    // Final verification
    log('VERIFY', 'Performing final verification...');
    
    const finalResponse = await axios.get(`${API_BASE_URL}/all`);
    const finalWorkers = finalResponse.data;
    
    const finalYadhnika = finalWorkers.find(w => w.id === 1);
    const finalString = finalWorkers.find(w => w.id === 3);
    
    successLog('FINAL', `Yadhnika status: ${finalYadhnika ? finalYadhnika.status : 'Unknown'}`);
    successLog('FINAL', `String worker status: ${finalString ? finalString.status : 'Unknown'}`);
    
    log('DONE', 'Worker ID conflict resolution complete');
    
  } catch (error) {
    errorLog('ERROR', `Failed to fix worker ID conflicts: ${error.message}`);
    if (error.response) {
      errorLog('RESPONSE', `Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
    }
  }
}

// Run the function
fixWorkerIdConflict();
