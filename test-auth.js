#!/usr/bin/env node

/**
 * Quick Auth Test Script
 * Run this to test both registration and login endpoints
 * 
 * Usage: node test-auth.js
 */

const API_URL = 'http://localhost:4002';

async function testEndpoints() {
  console.log('\n🧪 CRAFTLY AUTH TESTING\n');
  console.log(`API URL: ${API_URL}\n`);

  // Test 1: Server health
  console.log('1️⃣  Testing server health...');
  try {
    const healthRes = await fetch(`${API_URL}/health`);
    if (healthRes.ok) {
      console.log('✅ Server is running on port 4002\n');
    } else {
      console.log('❌ Server responded but with error status\n');
      return;
    }
  } catch (err) {
    console.log('❌ Cannot connect to backend on localhost:4002');
    console.log('   Make sure: cd backend && npm start\n');
    return;
  }

  // Test 2: Registration
  console.log('2️⃣  Testing registration endpoint...');
  const testEmail = `testuser-${Date.now()}@gmail.com`;
  const testPassword = 'TestPass123';
  const testName = 'Test User';

  try {
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
        name: testName
      })
    });

    const regData = await regRes.json();

    if (regRes.ok && regData.token) {
      console.log('✅ Registration successful');
      console.log(`   Email: ${testEmail}`);
      console.log(`   Token: ${regData.token.substring(0, 20)}...`);
      console.log(`   User: ${regData.user.name} (${regData.user.role})\n`);

      // Test 3: Login with registered user
      console.log('3️⃣  Testing login endpoint...');
      try {
        const loginRes = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: testEmail,
            password: testPassword
          })
        });

        const loginData = await loginRes.json();

        if (loginRes.ok && loginData.token) {
          console.log('✅ Login successful');
          console.log(`   Email: ${testEmail}`);
          console.log(`   Token: ${loginData.token.substring(0, 20)}...`);
          console.log(`   User: ${loginData.user.name}\n`);
        } else {
          console.log('❌ Login failed');
          console.log(`   Error: ${loginData.message || loginData.error}\n`);
        }
      } catch (err) {
        console.log('❌ Login request failed');
        console.log(`   Error: ${err.message}\n`);
      }

      // Test 4: Demo user login
      console.log('4️⃣  Testing demo user login...');
      try {
        const demoRes = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'demo@craftly.test',
            password: 'password'
          })
        });

        const demoData = await demoRes.json();

        if (demoRes.ok && demoData.token) {
          console.log('✅ Demo user login successful');
          console.log(`   Email: demo@craftly.test`);
          console.log(`   Token: ${demoData.token.substring(0, 20)}...`);
          console.log(`   User: ${demoData.user.name}\n`);
        } else {
          console.log('❌ Demo user login failed');
          console.log(`   Error: ${demoData.message || demoData.error}\n`);
        }
      } catch (err) {
        console.log('❌ Demo login request failed');
        console.log(`   Error: ${err.message}\n`);
      }

    } else {
      console.log('❌ Registration failed');
      console.log(`   Error: ${regData.message || regData.error}\n`);
    }
  } catch (err) {
    console.log('❌ Registration request failed');
    console.log(`   Error: ${err.message}\n`);
  }

  console.log('✅ Test completed!\n');
}

testEndpoints();
