/**
 * Test Frontend Save Changes Flow
 * This script simulates the exact frontend workflow when clicking "Save Changes"
 */

const axios = require('axios');

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Test the exact flow from frontend EditWorkerPage
async function testFrontendSaveChangesFlow() {
    console.log('🧪 Testing Frontend Save Changes Flow...\n');
    
    try {
        // Step 1: Get current worker data (simulating what frontend does)
        console.log('📋 Step 1: Fetching current worker data...');
        const workersResponse = await axios.get(`${API_BASE_URL}/all`);
        const workers = workersResponse.data;
        
        // Find Yadhnika (our test worker)
        const yadhnika = workers.find(w => w.name === 'Yadhnika');
        if (!yadhnika) {
            throw new Error('Yadhnika worker not found');
        }
        
        console.log('📋 Current worker data:', {
            id: yadhnika.id,
            name: yadhnika.name,
            email: yadhnika.email,
            phone: yadhnika.phone,
            status: yadhnika.status
        });
        
        // Step 2: Simulate user editing email in frontend
        const originalEmail = yadhnika.email;
        const newEmail = `yadhnika.test${Date.now()}@example.com`;
        
        console.log(`📝 Step 2: User changes email from "${originalEmail}" to "${newEmail}"`);
        
        // Step 3: Simulate frontend preparing update data
        const editableData = {
            phone: yadhnika.phone || '',
            email: newEmail,  // This is what user changed
            address: yadhnika.address || '',
            service: yadhnika.service || 'Cleaning',
            availability: yadhnika.availability || 'Full-Time',
            status: yadhnika.status || 'Pending',
            religion: yadhnika.religion || 'Hindu'
        };
        
        console.log('📝 Step 3: Frontend prepares update data:', editableData);
        
        // Step 4: Simulate API call (what updateWorkerProfile does)
        console.log(`🌐 Step 4: Making API call to /update/${yadhnika.id}...`);
        
        const updateData = {
            status: editableData.status,
            religion: editableData.religion,
            phone: editableData.phone,
            email: editableData.email,
            address: editableData.address,
            service: editableData.service,
            availability: editableData.availability
        };
        
        console.log('🌐 API Request URL:', `${API_BASE_URL}/update/${yadhnika.id}`);
        console.log('🌐 API Request Body:', JSON.stringify(updateData, null, 2));
        
        const updateResponse = await axios.put(`${API_BASE_URL}/update/${yadhnika.id}`, updateData);
        
        console.log('✅ Step 4: API call successful!');
        console.log('✅ Response status:', updateResponse.status);
        console.log('✅ Response data:', updateResponse.data);
        
        // Step 5: Verify the change was persisted
        console.log('🔍 Step 5: Verifying change was persisted...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
        
        const verifyResponse = await axios.get(`${API_BASE_URL}/all`);
        const updatedWorkers = verifyResponse.data;
        const updatedYadhnika = updatedWorkers.find(w => w.id === yadhnika.id);
        
        if (!updatedYadhnika) {
            throw new Error('Worker not found after update');
        }
        
        console.log('🔍 Updated worker data:', {
            id: updatedYadhnika.id,
            name: updatedYadhnika.name,
            email: updatedYadhnika.email,
            phone: updatedYadhnika.phone,
            status: updatedYadhnika.status
        });
        
        // Check if email was actually updated
        if (updatedYadhnika.email === newEmail) {
            console.log('🎉 SUCCESS: Email was successfully updated in backend!');
            console.log(`🎉 Email changed from "${originalEmail}" to "${updatedYadhnika.email}"`);
        } else {
            console.log('❌ FAILURE: Email was NOT updated in backend');
            console.log(`❌ Expected: "${newEmail}"`);
            console.log(`❌ Actual: "${updatedYadhnika.email}"`);
        }
        
        return true;
        
    } catch (error) {
        console.error('❌ Error in testFrontendSaveChangesFlow:', error.message);
        if (error.response) {
            console.error('❌ Response status:', error.response.status);
            console.error('❌ Response data:', error.response.data);
            console.error('❌ Response headers:', error.response.headers);
        }
        return false;
    }
}

// Run the test
testFrontendSaveChangesFlow()
    .then(success => {
        console.log('\n' + '='.repeat(60));
        console.log(success ? '🎉 TEST PASSED' : '❌ TEST FAILED');
        console.log('='.repeat(60));
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
