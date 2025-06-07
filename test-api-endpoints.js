import axios from 'axios';

const API_BASE_URL = 'https://meri-biwi-1.onrender.com';

async function testAvailableEndpoints() {
  console.log('🔍 Testing available API endpoints...\n');
  
  const endpoints = [
    { method: 'GET', path: '/all', description: 'Get all workers' },
    { method: 'GET', path: '/worker/1', description: 'Get single worker' },
    { method: 'POST', path: '/worker', description: 'Create worker' },
    { method: 'PUT', path: '/worker/1', description: 'Update worker' },
    { method: 'DELETE', path: '/worker/1', description: 'Delete worker' },
    { method: 'GET', path: '/', description: 'Root endpoint' }
  ];
  
  for (const endpoint of endpoints) {
    try {
      const url = `${API_BASE_URL}${endpoint.path}`;
      console.log(`Testing ${endpoint.method} ${endpoint.path} - ${endpoint.description}`);
      
      let response;
      switch (endpoint.method) {
        case 'GET':
          response = await axios.get(url);
          break;
        case 'POST':
          response = await axios.post(url, {});
          break;
        case 'PUT':
          response = await axios.put(url, {});
          break;
        case 'DELETE':
          response = await axios.delete(url);
          break;
      }
      
      console.log(`   ✅ Status: ${response.status} - Works!`);
      if (endpoint.path === '/all' && response.data) {
        console.log(`   📊 Data sample: ${JSON.stringify(response.data[0] || 'Empty', null, 2)}`);
      }
    } catch (error) {
      if (error.response) {
        console.log(`   ⚠️  Status: ${error.response.status} - ${error.response.statusText}`);
      } else {
        console.log(`   ❌ Network error: ${error.message}`);
      }
    }
    console.log();
  }
}

testAvailableEndpoints();
