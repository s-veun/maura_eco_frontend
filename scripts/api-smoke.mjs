#!/usr/bin/env node

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://demoprojectspring-production.up.railway.app/api/v1";

async function fetchJson(path) {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}`);
  }
  return response.json();
}

function asList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object") {
    return payload.data || payload.content || payload.products || [];
  }
  return [];
}

async function run() {
  const endpoints = [
    "/products",
    "/categories",
    "/products/popular/trending?limit=4",
  ];

  for (const endpoint of endpoints) {
    const payload = await fetchJson(endpoint);
    const list = asList(payload);
    console.log(`${endpoint} -> ${Array.isArray(list) ? list.length : 0} item(s)`);
  }
}

run().catch((error) => {
  console.error("API smoke test failed:", error.message);
  process.exit(1);
});

