import axios from 'axios';
import { Worker } from '@/types';
import { WorkerService } from './mockDatabase';

// API base URL
const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Worker ID mapping storage - keeps consistent frontend IDs
let workerIdMap = new Map<string, string>(); // phone -> frontend_id
let backendIdMap = new Map<string, string>(); // frontend_id -> backend_id

// Initialize some known worker mappings based on testing
// This helps avoid issues with ID resolution
function initializeKnownWorkerMappings() {
  // Create specific mappings for common workers to ensure consistency
  // Updated based on fix-worker-conflict.js verification
  
  // String - Backend ID 1 (verified)
  const stringFrontendId = "string_2345678";
  workerIdMap.set('2345678', stringFrontendId);
  backendIdMap.set(stringFrontendId, '1');
  backendIdMap.set('2345678', '1');
  
  // Yadhnika - Backend ID 2 (verified)
  const yadhnikaFrontendId = "yadhnika_9620393109";
  workerIdMap.set('9620393109', yadhnikaFrontendId);
  backendIdMap.set(yadhnikaFrontendId, '2');
  backendIdMap.set('9620393109', '2');
  
  // Tabtabidam - Backend ID 3 (verified)
  const tabtabidamFrontendId = "tabtabidam_456123789";
  workerIdMap.set('456123789', tabtabidamFrontendId);
  backendIdMap.set(tabtabidamFrontendId, '3');
  backendIdMap.set('456123789', '3');
  
  console.log("Known worker mappings initialized:", 
    {stringFrontendId, yadhnikaFrontendId, tabtabidamFrontendId});
}

// Initialize the mappings
initializeKnownWorkerMappings();

// Function to get or create a consistent frontend ID for a worker
function getFrontendWorkerId(workerData: any, backendIndex?: number): string {
  const phoneNumber = workerData.phone?.replace(/[^0-9]/g, '') || '';
  const workerName = workerData.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
  
  if (!phoneNumber) {
    // Fallback for workers without phone numbers
    const fallbackId = `worker_${workerName}_${Math.random().toString(36).substr(2, 6)}`;
    return fallbackId;
  }
  
  // Check if we already have a frontend ID for this phone number
  if (workerIdMap.has(phoneNumber)) {
    return workerIdMap.get(phoneNumber)!;
  }
  
  // Create a new frontend ID using the name and phone number
  const frontendId = `${workerName}_${phoneNumber}`;
  
  // Store the mapping
  workerIdMap.set(phoneNumber, frontendId);
  
  // Store backend mapping if we have index information
  if (backendIndex !== undefined) {
    // Backend uses 1-based indexing
    const backendId = (backendIndex + 1).toString();
    backendIdMap.set(frontendId, backendId);
  }
  
  return frontendId;
}

// Function to get backend ID for API calls
function getBackendId(frontendId: string): string {
  // Check if we have a stored mapping
  if (backendIdMap.has(frontendId)) {
    return backendIdMap.get(frontendId)!;
  }
  
  // If no mapping exists, try to find the worker by phone number via API
  // For now, use the frontend ID as fallback (it's usually the phone number)
  return frontendId;
}

// Function to find and cache backend ID by searching through all workers
async function findAndCacheBackendId(frontendId: string): Promise<string> {
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
      const cachedId = backendIdMap.get(frontendId)!;
      console.log(`🔍 ID RESOLVER: Found cached backend ID: ${cachedId}`);
      return cachedId;
    }
    
    // Fetch all workers to find the correct backend index
    const response = await axios.get(`${API_BASE_URL}/all`);
    
    if (response.data && Array.isArray(response.data)) {
      console.log(`Retrieved ${response.data.length} workers from API`);
      
      // First try to find by direct backend ID
      const workerById = response.data.find((worker: any) => worker.id?.toString() === frontendId);
      if (workerById) {
        console.log(`Found exact match by ID: ${workerById.name} (ID: ${workerById.id})`);
        return workerById.id.toString();
      }
      
      // Check if the frontend ID contains a name part that matches any worker
      const namePart = frontendId.split('_')[0];
      if (namePart) {
        const workerByName = response.data.find((worker: any) => {
          const workerName = worker.name?.toLowerCase().replace(/\s+/g, '_') || '';
          return workerName.includes(namePart) || namePart.includes(workerName);
        });
        
        if (workerByName) {
          console.log(`Found worker by name part: ${workerByName.name} (ID: ${workerByName.id})`);
          const backendId = workerByName.id?.toString();
          if (backendId) {
            backendIdMap.set(frontendId, backendId);
            return backendId;
          }
        }
      }
      
      // Try to find by phone number
      const workerByPhone = response.data.find((worker: any) => {
        // Clean phone number
        const workerPhone = worker.phone?.replace(/[^0-9]/g, '') || '';
        const frontendIdNumbers = frontendId.replace(/[^0-9]/g, '');
        // Check if this worker's phone contains our ID (which might be based on phone)
        return workerPhone.includes(frontendIdNumbers) || 
               frontendIdNumbers.includes(workerPhone) || 
               (worker.phone && worker.phone.includes(frontendId));
      });
      
      if (workerByPhone) {
        console.log(`Found worker by phone match: ${workerByPhone.name} (ID: ${workerByPhone.id})`);
        const backendId = workerByPhone.id?.toString();
        if (backendId) {
          backendIdMap.set(frontendId, backendId);
          return backendId;
        }
      }
      
      // If the frontend ID contains "string" (case insensitive), use ID 1
      if (frontendId.toLowerCase().includes('string')) {
        console.log('Name detection: String worker detected, using backend ID 1');
        backendIdMap.set(frontendId, '1');
        return '1';
      }
      
      // If the frontend ID contains "yadhnika" (case insensitive), use ID 2
      if (frontendId.toLowerCase().includes('yadhnika')) {
        console.log('Name detection: Yadhnika detected, using backend ID 2');
        backendIdMap.set(frontendId, '2');
        return '2';
      }
      
      // If the frontend ID contains "tabtabidam" (case insensitive), use ID 3
      if (frontendId.toLowerCase().includes('tabtabidam')) {
        console.log('Name detection: Tabtabidam detected, using backend ID 3');
        backendIdMap.set(frontendId, '3');
        return '3';
      }
      
      // Last resort: try to find by position in array
      // Checking if our frontend ID looks like it could be derived from an index
      const potentialIndex = parseInt(frontendId.replace(/\D/g, ''));
      if (!isNaN(potentialIndex) && potentialIndex > 0 && potentialIndex <= response.data.length) {
        const backendId = response.data[potentialIndex - 1].id?.toString();
        if (backendId) {
          console.log(`Found worker by index position: ${response.data[potentialIndex - 1].name} (ID: ${backendId})`);
          backendIdMap.set(frontendId, backendId);
          return backendId;
        }
      }
    }
    
    // At this point, we couldn't find a match, log this for debugging
    console.warn(`Could not find backend ID for frontend ID: ${frontendId}`);
    
    // Fallback: use frontend ID - this might actually work if frontend ID happens to match backend ID
    return frontendId;
  } catch (error) {
    console.error(`Error finding backend ID for frontend ID ${frontendId}:`, error);
    return frontendId;
  }
}

// Function to normalize worker status to valid frontend values
function normalizeWorkerStatus(backendStatus: string): 'Active' | 'Inactive' | 'Pending' | 'Rejected' {
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

// Function to map backend worker data to our Worker type
export function mapBackendWorkerToWorker(workerData: any, index?: number): Worker {
  // Get the consistent frontend ID for this worker
  const workerId = getFrontendWorkerId(workerData, index);
  
  return {
    id: workerId,
    fullName: workerData.name || "",
    email: workerData.email || "",
    phone: workerData.phone || "",
    address: workerData.address || "",
    city: workerData.city || "Mumbai",
    gender: workerData.gender || "Male",
    dateOfBirth: workerData.date_of_birth || "",
    serviceType: workerData.service || "Cleaning",
    experience: workerData.experience || 0,
    availability: workerData.availability || "Full-Time",
    idType: workerData.id_type || "Aadhar Card",
    idNumber: workerData.id_number || "",
    about: workerData.about || "",
    skills: workerData.skills?.split(',').map((s: string) => s.trim()) || [],
    status: normalizeWorkerStatus(workerData.status), // Use normalized status
    rating: workerData.rating || 0,
    totalBookings: workerData.total_bookings || 0,
    completionRate: workerData.completion_rate || 0,
    joiningDate: workerData.joining_date || "",
    createdAt: workerData.created_at || new Date().toISOString(),
    updatedAt: workerData.updated_at || new Date().toISOString(),
    idProofUrl: workerData.id_proof_url || null,
    photoUrl: workerData.photo_url || null,
    religion: workerData.religion || "Hindu", // Added religion field
  };
}

// Worker API Services
export const WorkerAPI = {
  // Test if API is accessible
  testConnection: async (): Promise<boolean> => {
    try {
      console.log("Testing API connection...");
      const response = await axios.get(`${API_BASE_URL}/all`, { timeout: 5000 });
      console.log(`API connection test successful. Status: ${response.status}`);
      return response.status === 200;
    } catch (error) {
      console.error("API connection test failed:", error.message);
      
      // Store offline status in localStorage for offline mode awareness
      try {
        localStorage.setItem('api_offline', 'true');
        localStorage.setItem('api_offline_since', new Date().toISOString());
        console.warn("API marked as offline in local storage");
      } catch (storageError) {
        console.error("Error updating offline storage:", storageError);
      }
      
      return false;
    }
  },

  // Fetch all workers
  getAllWorkers: async (): Promise<Worker[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      
      if (!response.data) {
        throw new Error('No data received from API');
      }
      
      return response.data.map((worker: any, index: number) => mapBackendWorkerToWorker(worker, index));
    } catch (error) {
      console.error("Error fetching all workers:", error);
      throw error;
    }
  },

  // Update worker status using the new endpoint
  updateWorkerStatus: async (workerId: string, status: 'Active' | 'Inactive' | 'Pending' | 'Rejected', religion: string = 'Hindu'): Promise<boolean> => {
    try {
      // First test the API connection to avoid long timeouts
      const isApiConnected = await WorkerAPI.testConnection();
      if (!isApiConnected) {
        console.warn("API is offline. Storing status change in local storage for later sync");
        
        try {
          // Store the change in localStorage for later sync
          const pendingChanges = JSON.parse(localStorage.getItem('pendingWorkerChanges') || '[]');
          pendingChanges.push({
            workerId,
            status,
            religion,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('pendingWorkerChanges', JSON.stringify(pendingChanges));
          
          // Apply change to mock database
          const mockWorker = WorkerService.getById(workerId);
          if (mockWorker) {
            WorkerService.update(workerId, { ...mockWorker, status });
          }
          
          // Return success - UI will reflect the change even though it's not saved on server yet
          return true;
        } catch (storageError) {
          console.error("Error storing pending change:", storageError);
          throw new Error("API is offline and failed to store change locally");
        }
      }
      
      // API is online, proceed with normal update
      // Get the correct backend ID for API call
      const backendId = await findAndCacheBackendId(workerId);
      
      console.log(`Updating worker status: Frontend ID ${workerId} → Backend ID ${backendId}`);
      
      // First try to get the current worker data to ensure we have all required fields
      let currentWorker;
      try {
        const allWorkers = await WorkerAPI.getAllWorkers();
        currentWorker = allWorkers.find(w => w.id === workerId);
        console.log(`Found worker data in API response: ${currentWorker ? 'Yes' : 'No'}`);
      } catch (fetchError) {
        console.warn(`Could not fetch current worker data: ${fetchError.message}`);
      }
      
      // If we found the worker, use its current values as defaults
      const updateData = {
        status: status,
        religion: religion || 'Hindu',
        // Include other required fields with defaults
        phone: currentWorker?.phone || '',
        email: currentWorker?.email || '',
        address: currentWorker?.address || '',
        service: currentWorker?.serviceType || 'Cleaning',
        availability: currentWorker?.availability || 'Full-Time'
      };
      
      console.log(`Sending update data for worker ${workerId}:`, JSON.stringify(updateData, null, 2));
      
      // First try with JSON body
      try {
        console.log(`PUT ${API_BASE_URL}/update/${backendId}`);
        const response = await axios.put(`${API_BASE_URL}/update/${backendId}`, updateData);
        console.log(`Update successful via JSON body. Status: ${response.status}`);
        return response.status === 200;
      } catch (jsonError) {
        console.warn(`JSON body update failed: ${jsonError.message}. Trying query parameters...`);
        
        // Fallback: try with query parameters (for backward compatibility)
        try {
          const queryUrl = `${API_BASE_URL}/update/${backendId}?new_status=${status}&new_religion=${religion || 'Hindu'}`;
          console.log(`Fallback to query params: ${queryUrl}`);
          const queryResponse = await axios.put(queryUrl);
          console.log(`Update successful via query parameters. Status: ${queryResponse.status}`);
          return queryResponse.status === 200;
        } catch (queryError) {
          console.error(`Both update methods failed. Query error:`, queryError.message);
          if (queryError.response) {
            console.error(`Response status: ${queryError.response.status}, data:`, queryError.response.data);
          }
          
          // Store the failed change for later sync
          try {
            const pendingChanges = JSON.parse(localStorage.getItem('pendingWorkerChanges') || '[]');
            pendingChanges.push({
              workerId,
              backendId,
              status,
              religion,
              timestamp: new Date().toISOString()
            });
            localStorage.setItem('pendingWorkerChanges', JSON.stringify(pendingChanges));
            console.log("Stored failed change for later synchronization");
            
            // Apply change to mock database
            const mockWorker = WorkerService.getById(workerId);
            if (mockWorker) {
              WorkerService.update(workerId, { ...mockWorker, status });
            }
            
            // Return success since we've stored it locally
            return true;
          } catch (storageError) {
            console.error("Error storing pending change:", storageError);
          }
          
          throw queryError;
        }
      }
    } catch (error) {
      console.error(`Error updating worker ${workerId} status to ${status}:`, error.message);
      if (error.response) {
        console.error(`Response status: ${error.response.status}, data:`, error.response.data);
      }
      throw error;
    }
  },

  // Approve a worker (change status to Active)
  approveWorker: async (workerId: string, religion: string = 'Hindu'): Promise<boolean> => {
    return await WorkerAPI.updateWorkerStatus(workerId, 'Active', religion);
  },

  // Reject a worker (change status to Rejected)
  rejectWorker: async (workerId: string, religion: string = 'Hindu'): Promise<boolean> => {
    return await WorkerAPI.updateWorkerStatus(workerId, 'Rejected', religion);
  },

  // Deactivate a worker (change status to Inactive)
  deactivateWorker: async (workerId: string, religion: string = 'Hindu'): Promise<boolean> => {
    return await WorkerAPI.updateWorkerStatus(workerId, 'Inactive', religion);
  },

  // Activate a worker (change status to Active)
  activateWorker: async (workerId: string, religion: string = 'Hindu'): Promise<boolean> => {
    return await WorkerAPI.updateWorkerStatus(workerId, 'Active', religion);
  },

  // Update worker profile with all editable fields
  updateWorkerProfile: async (
    workerId: string, 
    updates: {
      status?: 'Active' | 'Inactive' | 'Pending' | 'Rejected';
      religion?: string;
      phone?: string;
      email?: string;
      address?: string;
      service?: string;
      availability?: string;
    },
    currentWorker: Worker
  ): Promise<boolean> => {
    try {
      console.log("🔵 API SERVICE: updateWorkerProfile called");
      console.log("🔵 API SERVICE: workerId parameter:", workerId);
      console.log("🔵 API SERVICE: updates parameter:", updates);
      console.log("🔵 API SERVICE: currentWorker parameter:", currentWorker);
      
      // Get the correct backend ID for API call
      const backendId = await findAndCacheBackendId(workerId);
      
      console.log(`🔵 API SERVICE: Frontend ID ${workerId} → Backend ID ${backendId}`);
      
      // Merge current worker data with updates, ensuring all required fields are present
      const updateData = {
        status: updates.status || currentWorker.status,
        religion: updates.religion || currentWorker.religion || 'Hindu',
        phone: updates.phone || currentWorker.phone || '',
        email: updates.email || currentWorker.email || '',
        address: updates.address || currentWorker.address || '',
        service: updates.service || currentWorker.serviceType || 'Cleaning',
        availability: updates.availability || currentWorker.availability || 'Full-Time'
      };

      console.log('🔍 Current worker data:', {
        email: currentWorker.email,
        phone: currentWorker.phone,
        status: currentWorker.status,
        serviceType: currentWorker.serviceType
      });
      console.log('🔍 Updates to apply:', updates);
      console.log('Sending update data to API:', JSON.stringify(updateData, null, 2));
      console.log('API URL:', `${API_BASE_URL}/update/${backendId}`);

      try {
        // Try with JSON body first
        console.log("🌐 API CALL: Making PUT request to backend");
        console.log("🌐 API CALL: URL:", `${API_BASE_URL}/update/${backendId}`);
        console.log("🌐 API CALL: Payload:", JSON.stringify(updateData, null, 2));
        
        const response = await axios.put(`${API_BASE_URL}/update/${backendId}`, updateData);
        console.log('🌐 API CALL: Update successful with JSON body');
        console.log('🌐 API CALL: Response status:', response.status);
        console.log('🌐 API CALL: Response data:', response.data);
        
        const success = response.status === 200;
        console.log('🌐 API CALL: Returning success:', success);
        return success;
      } catch (jsonError) {
        console.error("🌐 API CALL: JSON body update failed:", jsonError);
        console.error("🌐 API CALL: Error details:", {
          message: jsonError.message,
          status: jsonError.response?.status,
          statusText: jsonError.response?.statusText,
          data: jsonError.response?.data
        });
        
        console.warn(`JSON body update failed: ${jsonError.message}. Trying query parameters...`);
        
        // Fallback: try with query parameters for backward compatibility
        const queryParams = new URLSearchParams();
        if (updates.status) queryParams.append('new_status', updates.status);
        if (updates.religion) queryParams.append('new_religion', updates.religion);
        
        const queryUrl = `${API_BASE_URL}/update/${backendId}?${queryParams.toString()}`;
        const queryResponse = await axios.put(queryUrl);
        
        console.log('Update successful with query parameters');
        return queryResponse.status === 200;
      }
    } catch (error) {
      console.error(`Error updating worker ${workerId} profile:`, error);
      throw error;
    }
  },

  // Delete a worker
  deleteWorker: async (workerId: string): Promise<boolean> => {
    try {
      // Get the correct backend ID for API call
      const backendId = await findAndCacheBackendId(workerId);
      
      console.log(`Deleting worker: Frontend ID ${workerId} → Backend ID ${backendId}`);
      
      // Use the correct delete-worker endpoint
      const response = await axios.delete(`${API_BASE_URL}/delete-worker/${backendId}`);
      
      if (response.status === 200) {
        console.log('Worker deletion successful');
        
        // Clean up local mappings for the deleted worker
        workerIdMap.forEach((frontendId, phone) => {
          if (frontendId === workerId) {
            workerIdMap.delete(phone);
          }
        });
        backendIdMap.delete(workerId);
        
        return true;
      } else {
        console.warn(`Delete request returned status: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.error(`Error deleting worker ${workerId}:`, error);
      throw error;
    }
  },

  // Debug and utility functions
  getIdMappings: () => {
    return {
      workerIdMap: Object.fromEntries(workerIdMap),
      backendIdMap: Object.fromEntries(backendIdMap)
    };
  },
  
  // Debug function to verify critical worker IDs
  verifyCriticalWorkerIds: async (): Promise<{
    success: boolean;
    string?: {id: string; name: string; status: string};
    yadhnika?: {id: string; name: string; status: string};
    tabtabidam?: {id: string; name: string; status: string};
    message: string;
    backendData?: {id1: string; id2: string; id3: string};
  }> => {
    try {
      // Get all workers
      const allWorkers = await WorkerAPI.getAllWorkers();
      if (!allWorkers.length) {
        return { success: false, message: "Failed to fetch workers from API" };
      }
      
      // Find our critical workers
      const stringWorker = allWorkers.find(w => 
        w.id.includes('string') || 
        (w.fullName && w.fullName.toLowerCase() === 'string')
      );
      
      const yadhnikaWorker = allWorkers.find(w => 
        w.id.includes('yadhnika') || 
        (w.fullName && w.fullName.toLowerCase().includes('yadhnika'))
      );
      
      const tabtabidamWorker = allWorkers.find(w => 
        w.id.includes('tabtabidam') || 
        (w.fullName && w.fullName.toLowerCase().includes('tabtabidam'))
      );
      
      // Get the backend version of these workers to verify IDs
      let backendWorkers = [];
      try {
        const response = await axios.get(`${API_BASE_URL}/all`);
        if (response.data && Array.isArray(response.data)) {
          backendWorkers = response.data;
        }
      } catch (error) {
        console.error("Error fetching backend workers for verification:", error);
      }
      
      const backendString = backendWorkers.find(w => w.id === 1);
      const backendYadhnika = backendWorkers.find(w => w.id === 2);
      const backendTabtabidam = backendWorkers.find(w => w.id === 3);
      
      return {
        success: true,
        string: stringWorker ? {
          id: await findAndCacheBackendId(stringWorker.id),
          name: stringWorker.fullName,
          status: stringWorker.status
        } : undefined,
        yadhnika: yadhnikaWorker ? {
          id: await findAndCacheBackendId(yadhnikaWorker.id),
          name: yadhnikaWorker.fullName,
          status: yadhnikaWorker.status
        } : undefined,
        tabtabidam: tabtabidamWorker ? {
          id: await findAndCacheBackendId(tabtabidamWorker.id),
          name: tabtabidamWorker.fullName,
          status: tabtabidamWorker.status
        } : undefined,
        message: "Worker ID verification complete",
        backendData: {
          id1: backendString ? backendString.name : "unknown",
          id2: backendYadhnika ? backendYadhnika.name : "unknown",
          id3: backendTabtabidam ? backendTabtabidam.name : "unknown"
        }
      };
    } catch (error) {
      console.error("Error verifying critical worker IDs:", error);
      return { success: false, message: error.message };
    }
  },

  // Manually set a backend ID mapping (useful for known workers)
  setBackendIdMapping: (frontendId: string, backendId: string) => {
    backendIdMap.set(frontendId, backendId);
  },

  // Clear all mappings (useful for testing)
  clearMappings: () => {
    workerIdMap.clear();
    backendIdMap.clear();
    // Reinitialize known mappings
    initializeKnownWorkerMappings();
  },
  
  // Sync all worker mappings with the backend
  syncWorkerMappings: async (): Promise<void> => {
    try {
      console.log('Syncing worker ID mappings with backend...');
      const response = await axios.get(`${API_BASE_URL}/all`);
      
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((worker: any, index: number) => {
          const backendId = worker.id?.toString() || (index + 1).toString();
          const phoneNumber = worker.phone?.replace(/[^0-9]/g, '') || '';
          const workerName = worker.name?.toLowerCase().replace(/\s+/g, '_') || 'worker';
          
          // Create a unique frontend ID that includes the worker name
          const frontendId = `${workerName}_${phoneNumber}`;
          
          if (phoneNumber) {
            workerIdMap.set(phoneNumber, frontendId);
          }
          
          if (frontendId && backendId) {
            // Map frontend ID to backend ID
            backendIdMap.set(frontendId, backendId);
            
            // Special handling for known workers to ensure consistency
            if (backendId === '1' && worker.name && worker.name.toLowerCase().includes('string')) {
              const stringFrontendId = "string_2345678";
              workerIdMap.set('2345678', stringFrontendId);
              backendIdMap.set(stringFrontendId, '1');
              console.log(`Special mapping for String: ${stringFrontendId} → Backend ID: 1`);
            }
            
            if (backendId === '2' && worker.name && worker.name.toLowerCase().includes('yadhnika')) {
              const yadhnikaFrontendId = "yadhnika_9620393109";
              workerIdMap.set('9620393109', yadhnikaFrontendId);
              backendIdMap.set(yadhnikaFrontendId, '2');
              console.log(`Special mapping for Yadhnika: ${yadhnikaFrontendId} → Backend ID: 2`);
            }
            
            if (backendId === '3' && worker.name && worker.name.toLowerCase().includes('tabtabidam')) {
              const tabtabidamFrontendId = "tabtabidam_456123789";
              workerIdMap.set('456123789', tabtabidamFrontendId);
              backendIdMap.set(tabtabidamFrontendId, '3');
              console.log(`Special mapping for Tabtabidam: ${tabtabidamFrontendId} → Backend ID: 3`);
            }
            
            // Also map direct phone number to backend ID for convenience
            if (phoneNumber) {
              backendIdMap.set(phoneNumber, backendId);
            }
          }
          
          console.log(`Mapped: ${worker.name} (Phone: ${worker.phone}) → Frontend ID: ${frontendId} → Backend ID: ${backendId}`);
        });
        
        console.log('Worker mappings synced successfully');
      }
    } catch (error) {
      console.error('Error syncing worker mappings:', error);
    }
  },

  // Sync any pending worker changes that were made while offline
  syncPendingWorkerChanges: async (): Promise<{success: number, failed: number}> => {
    try {
      // Check if we have any pending changes
      const pendingChangesJson = localStorage.getItem('pendingWorkerChanges');
      if (!pendingChangesJson) {
        console.log("No pending worker changes to sync");
        return { success: 0, failed: 0 };
      }
      
      const pendingChanges = JSON.parse(pendingChangesJson);
      if (!pendingChanges || !pendingChanges.length) {
        console.log("No pending worker changes to sync");
        return { success: 0, failed: 0 };
      }
      
      console.log(`Syncing ${pendingChanges.length} pending worker changes`);
      
      let successCount = 0;
      let failedCount = 0;
      
      // Process each pending change
      for (const change of pendingChanges) {
        try {
          const { workerId, status, religion } = change;
          
          // Try to apply the change
          const success = await WorkerAPI.updateWorkerStatus(workerId, status, religion);
          
          if (success) {
            successCount++;
            console.log(`Successfully synced change for worker ${workerId}`);
          } else {
            failedCount++;
            console.error(`Failed to sync change for worker ${workerId}`);
          }
        } catch (changeError) {
          failedCount++;
          console.error("Error syncing worker change:", changeError);
        }
      }
      
      // Remove the synced changes
      if (successCount > 0) {
        const remainingChanges = pendingChanges.filter((_, index) => index >= successCount);
        localStorage.setItem('pendingWorkerChanges', JSON.stringify(remainingChanges));
      }
      
      console.log(`Sync complete: ${successCount} succeeded, ${failedCount} failed`);
      return { success: successCount, failed: failedCount };
    } catch (error) {
      console.error("Error syncing pending worker changes:", error);
      return { success: 0, failed: 0 };
    }
  },
};
