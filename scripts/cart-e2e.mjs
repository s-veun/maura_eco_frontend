#!/usr/bin/env node

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://demoprojectspring-production.up.railway.app/api/v1";
const USERNAME = process.env.AUTH_SMOKE_USERNAME || "admin";
const PASSWORD = process.env.AUTH_SMOKE_PASSWORD || "123456";
const AUTO_REGISTER = process.env.AUTH_SMOKE_AUTO_REGISTER === "1";
const EMAIL =
  process.env.AUTH_SMOKE_EMAIL ||
  `${USERNAME.replace(/[^a-zA-Z0-9._-]/g, "").toLowerCase() || "carttest"}@example.com`;

function getAccessToken(payload) {
  return payload?.accessToken || payload?.token || payload?.jwt || null;
}

async function requestJson(path, init = {}, token) {
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data && "message" in data
        ? data.message
        : text || `Request failed: ${response.status}`;
    throw new Error(`${init.method || "GET"} ${path} -> ${response.status} ${message}`);
  }

  return data;
}

async function run() {
  console.log(`API base: ${API_BASE}`);
  console.log(`Using credentials for: ${USERNAME}`);

  let loginData;
  try {
    loginData = await requestJson(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
      },
    );
  } catch (error) {
    if (!AUTO_REGISTER) {
      throw error;
    }

    console.log("Login failed. Attempting auto-register flow...");
    await requestJson("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: USERNAME,
        email: EMAIL,
        password: PASSWORD,
      }),
    });
    console.log(`Registration succeeded for ${USERNAME}. Retrying login...`);

    loginData = await requestJson(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ username: USERNAME, password: PASSWORD }),
      },
    );
  }

  const accessToken = getAccessToken(loginData);
  const refreshToken = loginData?.refreshToken;

  if (!accessToken) {
    throw new Error("Login succeeded but no access token was returned.");
  }

  console.log("Login succeeded.");

  const profile = await requestJson("/profile", { method: "GET" }, accessToken);
  const userId = Number(profile?.id || profile?.data?.id || profile?.user?.id);

  if (!userId) {
    throw new Error("Profile request did not return a valid user id.");
  }

  console.log(`Profile loaded for user id ${userId}.`);

  const products = await requestJson("/products", { method: "GET" }, accessToken);
  const productList = Array.isArray(products)
    ? products
    : products?.products || products?.content || products?.data || [];
  const firstProduct = productList[0];

  if (!firstProduct?.proId) {
    throw new Error("Products endpoint returned no usable products.");
  }

  console.log(`Found product ${firstProduct.proId}: ${firstProduct.proName}`);

  const initialCart = await requestJson(`/cart/${userId}`, { method: "GET" }, accessToken);
  console.log(
    `Initial cart fetched with ${initialCart?.items?.length || 0} line items.`,
  );

  const addResult = await requestJson(
    `/cart/${userId}/add?productId=${firstProduct.proId}&quantity=1`,
    { method: "POST" },
    accessToken,
  );
  console.log(`Add to cart succeeded. Cart total: ${addResult?.totalPrice ?? "n/a"}`);

  const updatedLine =
    addResult?.items?.find((item) => item.productId === firstProduct.proId) || null;
  const nextQuantity = Math.max(2, Number(updatedLine?.quantity || 1) + 1);

  const updateResult = await requestJson(
    `/cart/${userId}/update?productId=${firstProduct.proId}&quantity=${nextQuantity}`,
    { method: "PUT" },
    accessToken,
  );
  console.log(`Quantity update succeeded. New quantity: ${nextQuantity}`);

  await requestJson(
    `/cart/${userId}/remove/${firstProduct.proId}`,
    { method: "DELETE" },
    accessToken,
  );
  console.log("Remove from cart succeeded.");

  const finalCart = await requestJson(`/cart/${userId}`, { method: "GET" }, accessToken);
  console.log(`Final cart fetched with ${finalCart?.items?.length || 0} line items.`);

  try {
    await requestJson(
      "/auth/logout",
      {
        method: "POST",
        body: JSON.stringify(refreshToken ? { refreshToken } : {}),
      },
      accessToken,
    );
    console.log("Logout succeeded.");
  } catch (error) {
    console.warn(
      `Logout endpoint warning: ${error instanceof Error ? error.message : String(error)}`,
    );
    console.warn("Frontend client logout still clears local auth and cart state.");
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
