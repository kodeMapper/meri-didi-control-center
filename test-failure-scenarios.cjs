/**
 * Test All Possible Frontend Failure Points
 * This script tests various scenarios that could cause the frontend to fail
 */

const axios = require('axios');

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

// Test different scenarios that might cause frontend failures
async function testFrontendFailureScenarios() {
    console.log('🧪 Testing All Possible Frontend Failure Scenarios...\n');
    
    try {
        // Get current worker state
        const workersResponse = await axios.get(`${API_BASE_URL}/all`);
        const workers = workersResponse.data;
        const yadhnika = workers.find(w => w.name === 'Yadhnika');
        
        if (!yadhnika) {
            throw new Error('Yadhnika worker not found');
        }
        
        console.log('📋 Current Yadhnika state:', {
            id: yadhnika.id,
            email: yadhnika.email,
            status: yadhnika.status,
            service: yadhnika.service
        });
        
        const tests = [];
        
        // Test 1: Exact same data (no changes)
        console.log('\n🧪 Test 1: Submitting exact same data (no changes)...');
        const sameData = {
            phone: yadhnika.phone,
            email: yadhnika.email,
            address: yadhnika.address,
            service: yadhnika.service,
            availability: yadhnika.availability,
            status: yadhnika.status,
            religion: yadhnika.religion
        };
        
        try {
            const response1 = await axios.put(`${API_BASE_URL}/update/${yadhnika.id}`, sameData);
            console.log('✅ Test 1 PASSED: Same data accepted');
            tests.push({test: 'Same data', passed: true});
        } catch (error) {
            console.log('❌ Test 1 FAILED: Same data rejected');
            console.log('❌ Error:', error.response?.data || error.message);
            tests.push({test: 'Same data', passed: false, error: error.message});
        }
        
        // Test 2: Empty/null values
        console.log('\n🧪 Test 2: Testing with empty/null values...');
        const emptyData = {
            phone: '',
            email: '',
            address: '',
            service: '',
            availability: '',
            status: '',
            religion: ''
        };
        
        try {
            const response2 = await axios.put(`${API_BASE_URL}/update/${yadhnika.id}`, emptyData);
            console.log('✅ Test 2 PASSED: Empty data accepted');
            tests.push({test: 'Empty data', passed: true});
        } catch (error) {
            console.log('❌ Test 2 FAILED: Empty data rejected');
            console.log('❌ Error:', error.response?.data || error.message);
            tests.push({test: 'Empty data', passed: false, error: error.message});
        }
        
        // Test 3: Missing fields
        console.log('\n🧪 Test 3: Testing with missing fields...');
        const missingFields = {
            email: `yadhnika.missing${Date.now()}@example.com`
            // Missing other fields
        };
        
        try {
            const response3 = await axios.put(`${API_BASE_URL}/update/${yadhnika.id}`, missingFields);
            console.log('✅ Test 3 PASSED: Missing fields accepted');
            tests.push({test: 'Missing fields', passed: true});
        } catch (error) {
            console.log('❌ Test 3 FAILED: Missing fields rejected');
            console.log('❌ Error:', error.response?.data || error.message);
            tests.push({test: 'Missing fields', passed: false, error: error.message});
        }
        
        // Test 4: Invalid status value
        console.log('\n🧪 Test 4: Testing with invalid status...');
        const invalidStatus = {
            ...sameData,
            status: 'InvalidStatus'
        };
        
        try {
            const response4 = await axios.put(`${API_BASE_URL}/update/${yadhnika.id}`, invalidStatus);
            console.log('✅ Test 4 PASSED: Invalid status accepted');
            tests.push({test: 'Invalid status', passed: true});
        } catch (error) {
            console.log('❌ Test 4 FAILED: Invalid status rejected');
            console.log('❌ Error:', error.response?.data || error.message);
            tests.push({test: 'Invalid status', passed: false, error: error.message});
        }
        
        // Test 5: Wrong content type
        console.log('\n🧪 Test 5: Testing with wrong content type...');
        try {
            const response5 = await axios.put(`${API_BASE_URL}/update/${yadhnika.id}`, sameData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            console.log('✅ Test 5 PASSED: Wrong content type accepted');
            tests.push({test: 'Wrong content type', passed: true});
        } catch (error) {
            console.log('❌ Test 5 FAILED: Wrong content type rejected');
            console.log('❌ Error:', error.response?.data || error.message);
            tests.push({test: 'Wrong content type', passed: false, error: error.message});
        }
        
        // Test 6: Very long email
        console.log('\n🧪 Test 6: Testing with very long email...');
        const longEmailData = {
            ...sameData,
            email: 'a'.repeat(100) + '@example.com'
        };
        
        try {
            const response6 = await axios.put(`${API_BASE_URL}/update/${yadhnika.id}`, longEmailData);
            console.log('✅ Test 6 PASSED: Long email accepted');
            tests.push({test: 'Long email', passed: true});
        } catch (error) {
            console.log('❌ Test 6 FAILED: Long email rejected');
            console.log('❌ Error:', error.response?.data || error.message);
            tests.push({test: 'Long email', passed: false, error: error.message});
        }
        
        // Test 7: Special characters in email
        console.log('\n🧪 Test 7: Testing with special characters...');
        const specialCharsData = {
            ...sameData,
            email: `test+special.chars${Date.now()}@example.com`
        };
        
        try {
            const response7 = await axios.put(`${API_BASE_URL}/update/${yadhnika.id}`, specialCharsData);
            console.log('✅ Test 7 PASSED: Special characters accepted');
            tests.push({test: 'Special characters', passed: true});
        } catch (error) {
            console.log('❌ Test 7 FAILED: Special characters rejected');
            console.log('❌ Error:', error.response?.data || error.message);
            tests.push({test: 'Special characters', passed: false, error: error.message});
        }
        
        // Test 8: Network timeout simulation
        console.log('\n🧪 Test 8: Testing with very short timeout...');
        try {
            const response8 = await axios.put(`${API_BASE_URL}/update/${yadhnika.id}`, sameData, {
                timeout: 1 // 1ms timeout
            });
            console.log('✅ Test 8 PASSED: Short timeout worked');
            tests.push({test: 'Short timeout', passed: true});
        } catch (error) {
            console.log('❌ Test 8 FAILED: Short timeout failed');
            console.log('❌ Error:', error.code || error.message);
            tests.push({test: 'Short timeout', passed: false, error: error.code || error.message});
        }
        
        // Restore original state
        console.log('\n🔄 Restoring original state...');
        try {
            await axios.put(`${API_BASE_URL}/update/${yadhnika.id}`, sameData);
            console.log('✅ Original state restored');
        } catch (error) {
            console.log('⚠️ Could not restore original state:', error.message);
        }
        
        // Summary
        console.log('\n📊 Test Results Summary:');
        tests.forEach((test, index) => {
            const status = test.passed ? '✅' : '❌';
            console.log(`${status} Test ${index + 1}: ${test.test} - ${test.passed ? 'PASSED' : 'FAILED'}`);
            if (!test.passed && test.error) {
                console.log(`   Error: ${test.error}`);
            }
        });
        
        const passed = tests.filter(t => t.passed).length;
        const total = tests.length;
        console.log(`\n📊 Overall: ${passed}/${total} tests passed`);
        
        return tests;
        
    } catch (error) {
        console.error('❌ Fatal error in testFrontendFailureScenarios:', error.message);
        if (error.response) {
            console.error('❌ Response status:', error.response.status);
            console.error('❌ Response data:', error.response.data);
        }
        return [];
    }
}

// Run the tests
testFrontendFailureScenarios()
    .then(results => {
        console.log('\n' + '='.repeat(60));
        const allPassed = results.length > 0 && results.every(r => r.passed);
        console.log(allPassed ? '🎉 ALL TESTS PASSED' : '⚠️ SOME TESTS FAILED');
        console.log('='.repeat(60));
    })
    .catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
