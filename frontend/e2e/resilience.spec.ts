import { test, expect } from "@playwright/test";

const backendUrl = "http://127.0.0.1:3001";
const providerUrl = "http://127.0.0.1:3101";

test("should serve the stale snapshot when the external provider becomes unavailable", async ({
  request,
}) => {
  await request.post(`${providerUrl}/reset`);

  const initialResponse = await request.get(`${backendUrl}/products`);
  expect(initialResponse.ok()).toBeTruthy();

  const initialPayload = await initialResponse.json();
  expect(initialPayload.data[0].title).toBe("Resilient Notebook");

  await request.post(`${providerUrl}/fail`);

  const loginResponse = await request.post(`${backendUrl}/auth/login`, {
    data: {
      username: "admin",
      password: "admin123",
    },
  });
  expect(loginResponse.ok()).toBeTruthy();

  const { token } = await loginResponse.json();
  const refreshResponse = await request.post(
    `${backendUrl}/products/refresh-cache`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  expect(refreshResponse.ok()).toBeTruthy();

  const fallbackResponse = await request.get(`${backendUrl}/products`);
  const fallbackPayload = await fallbackResponse.json();

  expect(fallbackResponse.ok()).toBeTruthy();
  expect(fallbackPayload.data[0].title).toBe("Resilient Notebook");
});
