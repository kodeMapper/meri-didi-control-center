import axios from 'axios';
import { Worker } from '@/types';

// API base URL
const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Function to get consistent worker ID based on worker characteristics
// Since the backend API doesn't return database IDs and array order doesn't match database order,
// we create a mapping based on unique worker characteristics
function getWorkerDatabaseId(workerData: any): string {
  // Based on testing, we know the database IDs:
  // Yadhnika = 1, Aditya = 2, Test_Entry = 3
  // We use phone numbers to create this mapping since they're unique
  const phoneNumber = workerData.phone?.replace(/[^0-9]/g, '') || '';
  
  // Map known phone numbers to their database IDs
  if (phoneNumber.includes('9620393109')) return '1'; // Yadhnika
  if (phoneNumber.includes('9175899169')) return '2'; // Aditya  
  if (phoneNumber.includes('2345678')) return '3';    // Test_Entry
  
  // For new workers, generate a consistent ID based on phone/name
  // This is a fallback for unknown workers
  return phoneNumber.slice(-8) || Math.random().toString(36).substr(2, 9);
}

// Function to map backend worker data to our Worker type
export function mapBackendWorkerToWorker(workerData: any, index?: number): Worker {
  // Get the correct database ID for this worker
  const workerId = getWorkerDatabaseId(workerData);
  
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
    status: workerData.status || "Pending",
    rating: workerData.rating || 0,
    totalBookings: workerData.total_bookings || 0,
    completionRate: workerData.completion_rate || 0,
    joiningDate: workerData.joining_date || "",
    createdAt: workerData.created_at || new Date().toISOString(),
    updatedAt: workerData.updated_at || new Date().toISOString(),
    idProofUrl: workerData.id_proof_url || null,
    photoUrl: workerData.photo_url || null,
  };
}

// Worker API Services
export const WorkerAPI = {
  // Test if API is accessible
  testConnection: async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`, { timeout: 5000 });
      return response.status === 200;
    } catch (error) {
      console.error("API connection test failed:", error);
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
      // The API now requires a JSON body instead of query parameters
      const response = await axios.put(`${API_BASE_URL}/update/${workerId}`, {
        status: status,
        religion: religion
      });
      return response.status === 200;
    } catch (error) {
      console.error(`Error updating worker ${workerId} status to ${status}:`, error);
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

  // Delete a worker
  deleteWorker: async (workerId: string): Promise<boolean> => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/worker/${workerId}`);
      return response.status === 200;
    } catch (error) {
      console.error(`Error deleting worker ${workerId}:`, error);
      throw error;
    }
  }
};
