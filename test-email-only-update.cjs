/**
 * Test Email-Only Update Scenario
 * This replicates the exact scenario when a user only changes email (no status change)
 */

const axios = require('axios');

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Test the specific email-only update scenario
async function testEmailOnlyUpdate() {
    console.log('🧪 Testing Email-Only Update Scenario...\n');
    
    try {
        // Step 1: Get current worker data
        console.log('📋 Step 1: Getting current worker data...');
        const workersResponse = await axios.get(`${API_BASE_URL}/all`);
        const workers = workersResponse.data;
        
        const yadhnika = workers.find(w => w.name === 'Yadhnika');
        if (!yadhnika) {
            throw new Error('Yadhnika worker not found');
        }
        
        console.log('📋 Current Yadhnika data:', {
            id: yadhnika.id,
            name: yadhnika.name,
            email: yadhnika.email,
            phone: yadhnika.phone,
            status: yadhnika.status,
            service: yadhnika.service,
            availability: yadhnika.availability,
            religion: yadhnika.religion
        });
        
        // Step 2: Simulate the exact frontend editableData
        const originalStatus = yadhnika.status;
        const originalEmail = yadhnika.email;
        const newEmail = `yadhnika.emailonly${Date.now()}@example.com`;
        
        // This is what the frontend creates in handleSaveChanges
        const editableData = {
            phone: yadhnika.phone || '',
            email: newEmail,  // User only changed this
            address: yadhnika.address || '',
            service: yadhnika.service || 'Cleaning', // Note: backend uses 'service'
            availability: yadhnika.availability || 'Full-Time',
            status: originalStatus,  // Status stays the same
            religion: yadhnika.religion || 'Hindu'
        };
        
        console.log('\n📝 Step 2: User edits only email...');
        console.log(`📝 Email: "${originalEmail}" → "${newEmail}"`);
        console.log(`📝 Status: "${originalStatus}" (unchanged)`);
        console.log('📝 Complete editable data:', JSON.stringify(editableData, null, 2));
        
        // Step 3: Check if frontend would detect status change
        const statusChanged = editableData.status !== originalStatus;
        console.log(`\n🔍 Step 3: Status change detection: ${statusChanged}`);
        console.log(`🔍 Original status: "${originalStatus}"`);
        console.log(`🔍 New status: "${editableData.status}"`);
        
        if (statusChanged) {
            console.log('🔍 Frontend would take STATUS CHANGE path');
        } else {
            console.log('🔍 Frontend would take NORMAL UPDATE path');
        }
        
        // Step 4: Simulate the API call that would be made
        console.log('\n🌐 Step 4: Making API call...');
        console.log(`🌐 URL: ${API_BASE_URL}/update/${yadhnika.id}`);
        console.log('🌐 Method: PUT');
        console.log('🌐 Body:', JSON.stringify(editableData, null, 2));
        
        const response = await axios.put(`${API_BASE_URL}/update/${yadhnika.id}`, editableData);
        
        console.log('✅ API call successful!');
        console.log('✅ Response status:', response.status);
        console.log('✅ Response data:', JSON.stringify(response.data, null, 2));
        
        // Step 5: Verify the change was persisted
        console.log('\n🔍 Step 5: Verifying change persistence...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
            status: updatedYadhnika.status,
            service: updatedYadhnika.service
        });
        
        // Check results
        const emailUpdated = updatedYadhnika.email === newEmail;
        const statusUnchanged = updatedYadhnika.status === originalStatus;
        
        console.log('\n📊 Results:');
        console.log(`📊 Email updated: ${emailUpdated}`);
        console.log(`📊 Status unchanged: ${statusUnchanged}`);
        
        if (emailUpdated && statusUnchanged) {
            console.log('🎉 SUCCESS: Email-only update worked correctly!');
            return true;
        } else {
            console.log('❌ FAILURE: Email-only update failed');
            if (!emailUpdated) {
                console.log(`❌ Email not updated. Expected: "${newEmail}", Got: "${updatedYadhnika.email}"`);
            }
            if (!statusUnchanged) {
                console.log(`❌ Status unexpectedly changed. Expected: "${originalStatus}", Got: "${updatedYadhnika.status}"`);
            }
            return false;
        }
        
    } catch (error) {
        console.error('❌ Error in testEmailOnlyUpdate:', error.message);
        if (error.response) {
            console.error('❌ Response status:', error.response.status);
            console.error('❌ Response data:', error.response.data);
        }
        return false;
    }
}

// Run the test
testEmailOnlyUpdate()
    .then(success => {
        console.log('\n' + '='.repeat(60));
        console.log(success ? '🎉 EMAIL-ONLY UPDATE TEST PASSED' : '❌ EMAIL-ONLY UPDATE TEST FAILED');
        console.log('='.repeat(60));
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
