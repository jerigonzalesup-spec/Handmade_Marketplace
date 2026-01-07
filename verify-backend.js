#!/usr/bin/env node

/**
 * Quick Backend Verification Script
 * Tests auth endpoints without needing browser
 * 
 * Usage: node verify-backend.js
 */

const BASE_URL = 'http://localhost:4000/api';

async function testEndpoint(method, path, body = null, label = '') {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await response.json();

    const status = response.ok ? '✅' : '❌';
    console.log(`\n${status} ${label || `${method} ${path}`}`);
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, JSON.stringify(data, null, 2));

    return { ok: response.ok, data, status: response.status };
  } catch (err) {
    console.error(`\n❌ ${label || `${method} ${path}`}`);
    console.error(`   Error: ${err.message}`);
    return { ok: false, error: err.message };
  }
}

async function runTests() {
  console.log('🧪 Craftly Backend Verification\n');
  console.log(`Testing: ${BASE_URL}\n`);

  // Test 1: Health Check
  console.log('1️⃣ Testing health endpoint...');
  await testEndpoint('GET', '/health', null, 'GET /health');

  // Test 2: Root endpoint
  console.log('\n2️⃣ Testing root endpoint (API root)...');
  await testEndpoint('GET', '/', null, 'GET / (API root)');

  // Test 3: Register new user
  console.log('\n3️⃣ Testing registration...');
  const testEmail = `test-${Date.now()}@gmail.com`;
  const registerResult = await testEndpoint(
    'POST',
    '/auth/register',
    {
      email: testEmail,
      password: 'TestPass123',
      name: 'Test User'
    },
    'POST /auth/register'
  );

  // Test 4: Login with demo user
  console.log('\n4️⃣ Testing login with demo user...');
  const loginResult = await testEndpoint(
    'POST',
    '/auth/login',
    {
      email: 'demo@craftly.test',
      password: 'password'
    },
    'POST /auth/login'
  );

  // Test 5: Protected route with token
  if (loginResult.ok && loginResult.data.token) {
    console.log('\n5️⃣ Testing protected route (/auth/me)...');
    try {
      const response = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginResult.data.token}`
        }
      });
      const data = await response.json();
      const status = response.ok ? '✅' : '❌';
      console.log(`\n${status} GET /auth/me (protected)`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(`\n❌ GET /auth/me (protected)`);
      console.error(`   Error: ${err.message}`);
    }
  }

  // Test 6: Invalid credentials
  console.log('\n6️⃣ Testing login with invalid credentials...');
  await testEndpoint(
    'POST',
    '/auth/login',
    {
      email: 'invalid@test.com',
      password: 'wrongpassword'
    },
    'POST /auth/login (invalid credentials)'
  );

  console.log('\n' + '='.repeat(50));
  console.log('✅ Verification Complete!');
  console.log('\nNext Steps:');
  console.log('1. If all tests ✅ - Backend is working correctly');
  console.log('2. If any tests ❌ - Check backend logs and fix issues');
  console.log('3. Start frontend: cd client && npm run dev');
  console.log('4. Test in browser: http://localhost:5173/signup');
  console.log('='.repeat(50));
}

runTests().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
