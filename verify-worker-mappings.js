// verify-worker-mappings.js
// This script verifies that worker ID mappings are correct and helps identify any issues
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

// Known worker mappings - Critical IDs that must be correct
const criticalWorkers = {
  'yadhnika': {
    id: 1,
    name: 'Yadhnika',
    phone: '9620393109'
  },
  'string': {
    id: 3,
    name: 'string',
    phone: '2345678'
  }
};

// Frontend ID format utility
function generateFrontendId(name, phone) {
  const cleanName = name?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
  const cleanPhone = phone?.replace(/[^0-9]/g, '') || '';
  return `${cleanName}_${cleanPhone}`;
}

// Validate all worker IDs and mappings
async function verifyWorkerMappings() {
  log('START', 'Beginning worker ID mapping verification', colors.magenta);
  
  try {
    // Step 1: Get all workers from API
    log('FETCH', 'Getting all workers from API...');
    const response = await axios.get(`${API_BASE_URL}/all`);
    
    if (!response.data || !Array.isArray(response.data)) {
      errorLog('ERROR', 'Failed to get workers from API or invalid response format');
      return false;
    }
    
    const workers = response.data;
    successLog('FETCH', `Successfully retrieved ${workers.length} workers from API`);
    
    // Step 2: Check critical workers
    log('CHECK', 'Verifying critical worker IDs...', colors.blue);
    
    const yadhnika = workers.find(w => w.id === criticalWorkers.yadhnika.id);
    const string = workers.find(w => w.id === criticalWorkers.string.id);
    
    // Verify Yadhnika
    if (yadhnika) {
      if (yadhnika.name.toLowerCase().includes('yadhnika')) {
        successLog('MATCH', `Worker ID ${yadhnika.id} is correctly mapped to Yadhnika`);
      } else {
        errorLog('MISMATCH', `Worker ID ${yadhnika.id} maps to "${yadhnika.name}" instead of Yadhnika!`);
      }
    } else {
      errorLog('MISSING', `Critical worker Yadhnika (ID: ${criticalWorkers.yadhnika.id}) not found`);
    }
    
    // Verify String
    if (string) {
      if (string.name.toLowerCase().includes('string')) {
        successLog('MATCH', `Worker ID ${string.id} is correctly mapped to string`);
      } else {
        errorLog('MISMATCH', `Worker ID ${string.id} maps to "${string.name}" instead of string!`);
      }
    } else {
      errorLog('MISSING', `Critical worker string (ID: ${criticalWorkers.string.id}) not found`);
    }
    
    // Step 3: Generate frontend IDs for all workers and check for duplicates
    log('CHECK', 'Checking for potential frontend ID conflicts...', colors.blue);
    
    const frontendIdMap = new Map();
    const duplicates = [];
    
    workers.forEach(worker => {
      const frontendId = generateFrontendId(worker.name, worker.phone);
      
      if (frontendIdMap.has(frontendId)) {
        duplicates.push({
          frontendId,
          workers: [
            frontendIdMap.get(frontendId),
            { id: worker.id, name: worker.name, phone: worker.phone }
          ]
        });
      } else {
        frontendIdMap.set(frontendId, { id: worker.id, name: worker.name, phone: worker.phone });
      }
    });
    
    if (duplicates.length > 0) {
      warningLog('DUPLICATES', `Found ${duplicates.length} potential frontend ID conflicts:`);
      duplicates.forEach((dup, i) => {
        console.log(`\n${colors.yellow}Duplicate #${i+1}: Frontend ID "${dup.frontendId}"${colors.reset}`);
        dup.workers.forEach(w => {
          console.log(`  - Backend ID ${w.id}: ${w.name} (${w.phone})`);
        });
      });
    } else {
      successLog('NO_DUPLICATES', 'No potential frontend ID conflicts found');
    }
    
    // Step 4: Verify special cases can be resolved correctly
    log('VERIFY', 'Testing special case ID resolution...', colors.blue);
    
    const yadhnikaFrontendId = generateFrontendId('Yadhnika', '9620393109');
    console.log(`  Yadhnika frontend ID would be: ${yadhnikaFrontendId}`);
    
    const stringFrontendId = generateFrontendId('string', '2345678');
    console.log(`  String frontend ID would be: ${stringFrontendId}`);

    successLog('COMPLETE', 'Worker ID mapping verification completed successfully!', colors.magenta);
    return true;
  } catch (error) {
    errorLog('ERROR', `Worker ID verification failed: ${error.message}`);
    return false;
  }
}

// Run the verification
verifyWorkerMappings().then(success => {
  if (success) {
    console.log('\n✅ Worker ID mapping verification completed.');
  } else {
    console.log('\n❌ Worker ID mapping verification failed.');
    console.log('Please check the logs above for details.');
  }
});
