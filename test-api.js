const axios = require('axios');

// API base URL
const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Function to map backend worker data to our Worker type
function mapBackendWorkerToWorker(workerData, index) {
  const workerId = (index !== undefined ? (index + 1).toString() : 
                   workerData.id?.toString() || 
                   workerData.phone?.replace(/[^0-9]/g, '').slice(-8) || 
                   Math.random().toString(36).substr(2, 9));
  
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
    skills: workerData.skills?.split(',').map(s => s.trim()) || [],
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

async function testWorkerAPI() {
  console.log('🧪 Testing Worker API Integration\n');
  
  try {
    // Test 1: Connection test
    console.log('1️⃣ Testing API connection...');
    const healthResponse = await axios.get(`${API_BASE_URL}/all`, { timeout: 5000 });
    console.log('✅ API connected successfully');
    console.log(`📊 Raw API response: ${JSON.stringify(healthResponse.data, null, 2)}\n`);
    
    // Test 2: Get all workers and map them
    console.log('2️⃣ Testing worker data mapping...');
    const mappedWorkers = healthResponse.data.map((worker, index) => mapBackendWorkerToWorker(worker, index));
    console.log('✅ Workers mapped successfully');
    console.log(`👥 Mapped workers count: ${mappedWorkers.length}`);
    mappedWorkers.forEach(worker => {
      console.log(`   - ID: ${worker.id}, Name: ${worker.fullName}, Service: ${worker.serviceType}, Status: ${worker.status}`);
    });
    console.log('');
    
    // Test 3: Test status filter
    console.log('3️⃣ Testing status filtering...');
    const activeWorkers = mappedWorkers.filter(worker => worker.status === 'Active');
    const pendingWorkers = mappedWorkers.filter(worker => worker.status === 'Pending');
    const inactiveWorkers = mappedWorkers.filter(worker => worker.status === 'Inactive');
    const rejectedWorkers = mappedWorkers.filter(worker => worker.status === 'Rejected');
    
    console.log(`✅ Status filtering results:`);
    console.log(`   - Active: ${activeWorkers.length}`);
    console.log(`   - Pending: ${pendingWorkers.length}`);
    console.log(`   - Inactive: ${inactiveWorkers.length}`);
    console.log(`   - Rejected: ${rejectedWorkers.length}\n`);
    
    // Test 4: Test status update
    console.log('4️⃣ Testing status update...');
    if (mappedWorkers.length > 0) {
      const testWorker = mappedWorkers[0];
      const originalStatus = testWorker.status;
      const newStatus = originalStatus === 'Active' ? 'Inactive' : 'Active';
      
      console.log(`🔄 Updating worker ${testWorker.id} (${testWorker.fullName}) from ${originalStatus} to ${newStatus}...`);
      
      const updateResponse = await axios.put(`${API_BASE_URL}/update/${testWorker.id}?new_status=${newStatus}`);
      console.log(`✅ Status update response: ${JSON.stringify(updateResponse.data)}`);
      
      // Verify the update
      const verifyResponse = await axios.get(`${API_BASE_URL}/all`);
      const updatedWorker = verifyResponse.data.find((w, index) => (index + 1).toString() === testWorker.id);
      console.log(`✅ Verification: Worker status is now ${updatedWorker.status}`);
      
      // Restore original status
      console.log(`🔄 Restoring original status...`);
      await axios.put(`${API_BASE_URL}/update/${testWorker.id}?new_status=${originalStatus}`);
      console.log(`✅ Status restored to ${originalStatus}\n`);
    }
    
    console.log('🎉 All API tests passed successfully!');
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testWorkerAPI();
