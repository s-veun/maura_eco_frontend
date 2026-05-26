#!/usr/bin/env node

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://demoprojectspring-production.up.railway.app/api/v1";
const USERNAME = process.env.AUTH_SMOKE_USERNAME;
const PASSWORD = process.env.AUTH_SMOKE_PASSWORD;

if (!USERNAME || !PASSWORD) {
  console.error("Missing AUTH_SMOKE_USERNAME or AUTH_SMOKE_PASSWORD environment variables.");
  process.exit(1);
}

const loginUrl = `${API_BASE}/auth/login`;
const refreshUrl = `${API_BASE}/auth/refresh`;

async function run() {
  console.log(`Login endpoint: ${loginUrl}`);

  const loginResponse = await fetch(loginUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
  });

  const loginData = await loginResponse.json();
  console.log(`Login status: ${loginResponse.status}`);

  const accessToken = loginData.accessToken || loginData.token || loginData.jwt;
  const refreshToken = loginData.refreshToken;

  if (!accessToken) {
    throw new Error("No access token returned from login endpoint.");
  }

  console.log("Access token received.");

  if (!refreshToken) {
    console.log("Refresh token not returned by API. Skipping refresh check.");
    return;
  }

  const refreshResponse = await fetch(refreshUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const refreshData = await refreshResponse.json();
  const refreshedAccessToken = refreshData.accessToken || refreshData.token || refreshData.jwt;

  console.log(`Refresh status: ${refreshResponse.status}`);
  if (!refreshedAccessToken) {
    throw new Error("Refresh endpoint did not return a new access token.");
  }

  console.log("Refresh token flow validated.");
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

