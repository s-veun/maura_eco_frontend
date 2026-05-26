/**
 * OAuth2 Frontend Callback Token Parsing - Browser Console Testing
 *
 * Run these tests directly in the browser console on the /auth/callback page
 * to validate token extraction and parsing
 *
 * Usage:
 * 1. Open frontend at https://your-frontend.up.railway.app/auth/callback?accessToken=...
 * 2. Open Browser DevTools (F12 > Console)
 * 3. Copy and paste the tests below
 * 4. Verify all tests pass (should show "✓ PASS")
 */

/**
 * Test Suite: OAuth2 Token Extraction
 */
console.log('🧪 Starting OAuth2 Token Extraction Tests...\n');

// ============================================================================
// TEST 1: Extract tokens from current URL
// ============================================================================
console.log('TEST 1: Extract tokens from current URL');
try {
  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get('accessToken');
  const refreshToken = url.searchParams.get('refreshToken');
  const provider = url.searchParams.get('provider');
  const error = url.searchParams.get('error');
  const message = url.searchParams.get('message');

  console.log('  Current URL:', url.href);
  console.log('  Access Token:', accessToken || '(not present)');
  console.log('  Refresh Token:', refreshToken || '(not present)');
  console.log('  Provider:', provider || '(not present)');
  console.log('  Error:', error || '(not present)');
  console.log('  Message:', message || '(not present)');

  if (accessToken) {
    console.log('✓ PASS: Access token found in URL\n');
  } else if (error) {
    console.log('⚠️  Note: OAuth error detected (expected if user denied access)\n');
  } else {
    console.log('⚠️  FAIL: No access token or error in URL\n');
  }
} catch (err) {
  console.error('✗ FAIL:', err.message, '\n');
}

// ============================================================================
// TEST 2: Validate token is JWT format
// ============================================================================
console.log('TEST 2: Validate access token is JWT format');
try {
  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get('accessToken');

  if (!accessToken) {
    console.log('⚠️  SKIP: No access token to validate\n');
  } else {
    const parts = accessToken.split('.');

    console.log('  Token parts:', parts.length);

    if (parts.length === 3) {
      console.log('  Header length:', parts[0].length);
      console.log('  Payload length:', parts[1].length);
      console.log('  Signature length:', parts[2].length);

      // Try to decode payload
      try {
        const payload = JSON.parse(atob(parts[1]));
        console.log('  Decoded payload:', payload);

        if (payload.sub || payload.username || payload.email) {
          console.log('✓ PASS: Token is valid JWT with user info\n');
        } else {
          console.log('⚠️  WARN: Token decoded but missing expected claims\n');
        }
      } catch (e) {
        console.log('⚠️  WARN: Could not decode payload:', e.message, '\n');
      }
    } else {
      console.log('✗ FAIL: Token does not have 3 parts (not valid JWT)\n');
    }
  }
} catch (err) {
  console.error('✗ FAIL:', err.message, '\n');
}

// ============================================================================
// TEST 3: Check localStorage storage
// ============================================================================
console.log('TEST 3: Check token storage in localStorage');
try {
  const storedAccessToken = localStorage.getItem('accessToken');
  const storedRefreshToken = localStorage.getItem('refreshToken');

  console.log('  Stored access token:', storedAccessToken ? '(present, ' + storedAccessToken.length + ' chars)' : '(not found)');
  console.log('  Stored refresh token:', storedRefreshToken ? '(present, ' + storedRefreshToken.length + ' chars)' : '(not found)');

  if (storedAccessToken && storedRefreshToken) {
    console.log('✓ PASS: Both tokens stored in localStorage\n');
  } else if (storedAccessToken) {
    console.log('⚠️  WARN: Only access token stored, refresh token missing\n');
  } else {
    console.log('⚠️  WARN: Tokens not yet stored (callback handler may still be running)\n');
  }
} catch (err) {
  console.error('✗ FAIL:', err.message, '\n');
}

// ============================================================================
// TEST 4: Validate token expiration
// ============================================================================
console.log('TEST 4: Check token expiration');
try {
  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get('accessToken');

  if (!accessToken) {
    console.log('⚠️  SKIP: No access token to validate\n');
  } else {
    try {
      const parts = accessToken.split('.');
      const payload = JSON.parse(atob(parts[1]));

      const currentTime = Math.floor(Date.now() / 1000);
      const expirationTime = payload.exp;

      if (expirationTime) {
        const timeUntilExpiry = expirationTime - currentTime;
        const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60);

        console.log('  Current time:', new Date(currentTime * 1000).toISOString());
        console.log('  Token expiry:', new Date(expirationTime * 1000).toISOString());
        console.log('  Time until expiry:', minutesUntilExpiry + ' minutes');

        if (timeUntilExpiry > 0) {
          console.log('✓ PASS: Token is not expired\n');
        } else {
          console.log('✗ FAIL: Token is already expired\n');
        }
      } else {
        console.log('⚠️  WARN: Token has no expiration claim\n');
      }
    } catch (e) {
      console.log('⚠️  WARN: Could not validate expiration:', e.message, '\n');
    }
  }
} catch (err) {
  console.error('✗ FAIL:', err.message, '\n');
}

// ============================================================================
// TEST 5: Test token in API call (manual)
// ============================================================================
console.log('TEST 5: Test token with actual API call (manual test)');
try {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    console.log('⚠️  SKIP: No stored access token\n');
  } else {
    console.log('  Will test token by making API call...');
    console.log('  Run this in next step:');
    console.log(`
    fetch('{{API_BASE_URL}}/user/profile', {
      headers: {
        'Authorization': 'Bearer ${accessToken.substring(0, 20)}...'
      }
    })
    .then(r => r.json())
    .then(data => console.log('✓ API Response:', data))
    .catch(e => console.error('✗ API Error:', e));
    `);
  }
} catch (err) {
  console.error('✗ FAIL:', err.message, '\n');
}

// ============================================================================
// TEST 6: Verify frontend callback page components
// ============================================================================
console.log('TEST 6: Verify frontend callback page structure');
try {
  // Check if we're on the callback page
  if (window.location.pathname.includes('/auth/callback')) {
    console.log('✓ PASS: On /auth/callback page\n');
  } else {
    console.log('⚠️  WARN: Not on /auth/callback page (you\'re on ' + window.location.pathname + ')\n');
  }
} catch (err) {
  console.error('✗ FAIL:', err.message, '\n');
}

// ============================================================================
// TEST 7: Check for authentication context
// ============================================================================
console.log('TEST 7: Check authentication context (React)');
try {
  // Look for React auth provider or context
  const authElement = document.querySelector('[data-auth-context]');

  if (authElement) {
    console.log('✓ PASS: Auth context provider found\n');
  } else {
    console.log('⚠️  Note: Could not find data-auth-context element\n');
    console.log('         This is expected if using context without data attributes\n');
  }
} catch (err) {
  console.error('✗ FAIL:', err.message, '\n');
}

// ============================================================================
// TEST 8: Simulate frontend token extraction (like OAuthCallbackClient does)
// ============================================================================
console.log('TEST 8: Simulate frontend token extraction logic');
try {
  const url = new URL(window.location.href);

  // This mimics OAuthCallbackClient.tsx extraction logic
  const accessToken =
    url.searchParams.get('accessToken') ||
    url.searchParams.get('token') ||
    url.searchParams.get('jwt');
  const refreshToken = url.searchParams.get('refreshToken') || undefined;
  const error = url.searchParams.get('error');
  const message = url.searchParams.get('message');

  console.log('  Extraction logic (mimics OAuthCallbackClient):');
  console.log('    accessToken:', accessToken ? '✓ found' : '✗ not found');
  console.log('    refreshToken:', refreshToken ? '✓ found' : '✗ not found');
  console.log('    error:', error ? '✓ found: ' + error : '✗ not found');
  console.log('    message:', message ? '✓ found: ' + message : '✗ not found');

  if (accessToken || error) {
    console.log('✓ PASS: Token or error extraction successful\n');
  } else {
    console.log('✗ FAIL: Neither token nor error found\n');
  }
} catch (err) {
  console.error('✗ FAIL:', err.message, '\n');
}

// ============================================================================
// TEST 9: Check browser storage limits
// ============================================================================
console.log('TEST 9: Check browser storage capacity');
try {
  const url = new URL(window.location.href);
  const accessToken = url.searchParams.get('accessToken');

  if (accessToken && accessToken.length > 5000) {
    console.log('⚠️  WARN: Token is very large (' + accessToken.length + ' chars)');
    console.log('         Consider using HttpOnly cookies instead\n');
  } else {
    console.log('✓ PASS: Token size is reasonable for storage\n');
  }
} catch (err) {
  console.error('✗ FAIL:', err.message, '\n');
}

// ============================================================================
// TEST 10: Verify backend response shape compatibility
// ============================================================================
console.log('TEST 10: Verify response shape compatibility');
try {
  const url = new URL(window.location.href);
  const provider = url.searchParams.get('provider');

  const responseShapeChecks = {
    'accessToken': url.searchParams.get('accessToken') ? '✓' : '✗',
    'refreshToken': url.searchParams.get('refreshToken') ? '✓' : '✗',
    'provider': provider ? ('✓ ' + provider) : '✗',
    'tokenType': 'Bearer (assumed)',
    'expiresIn': '3600 (assumed)'
  };

  console.log('  Backend OAuth2LoginResponse fields:');
  Object.entries(responseShapeChecks).forEach(([key, value]) => {
    console.log('    ' + key + ':', value);
  });

  if (responseShapeChecks.accessToken === '✓' && responseShapeChecks.refreshToken === '✓') {
    console.log('✓ PASS: All required fields present\n');
  } else {
    console.log('⚠️  WARN: Some fields missing from response\n');
  }
} catch (err) {
  console.error('✗ FAIL:', err.message, '\n');
}

// ============================================================================
// TEST SUMMARY
// ============================================================================
console.log('═'.repeat(60));
console.log('📊 TOKEN EXTRACTION TEST SUMMARY');
console.log('═'.repeat(60));
console.log(`
✅ If you see this, the browser console is working correctly
✅ Run these tests on the /auth/callback page with tokens in URL
✅ Share the console output for debugging if tests fail

Common issues:
  - No tokens in URL: Check OAUTH2_AUTHORIZED_REDIRECT_URI is set
  - CORS errors: Check CORS configuration on backend
  - 401 errors: Check JWT_SECRET is consistent
  - Expired tokens: Check JWT_ACCESS_TOKEN_EXPIRATION setting

Next steps:
  1. Verify all tests above pass (✓)
  2. Check localStorage for stored tokens
  3. Test API call with token
  4. Monitor Network tab for token validation
`);
console.log('═'.repeat(60));

// ============================================================================
// HELPER FUNCTION: Test API endpoint with token
// ============================================================================
console.log('\n');
console.log('HELPER: Test API with Token');
console.log('─'.repeat(60));
console.log('Run this function to test your API:');
console.log(`
  window.testApiWithToken = async (apiUrl = '{{API_BASE_URL}}/user/profile') => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No access token in localStorage');
      return;
    }
    try {
      const response = await fetch(apiUrl, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await response.json();
      console.log('Status:', response.status);
      console.log('Response:', data);
      return data;
    } catch (e) {
      console.error('Error:', e.message);
    }
  };
  
  // Then call:
  window.testApiWithToken();
`);

// Make it available
window.testApiWithToken = async (apiUrl) => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.error('❌ No access token in localStorage');
    return;
  }
  try {
    console.log('🔗 Testing API:', apiUrl);
    const response = await fetch(apiUrl, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const data = await response.json();
    console.log('✓ Status:', response.status);
    console.log('✓ Response:', data);
    return data;
  } catch (e) {
    console.error('✗ Error:', e.message);
  }
};

console.log('✓ testApiWithToken() function registered\n');

