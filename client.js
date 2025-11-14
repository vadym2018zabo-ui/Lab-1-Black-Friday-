// Функція з таймаутом та ретраями
async function fetchWithRetry(url, options, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // таймаут 2с

    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);

      // Якщо сервер повернув 429 → чекаємо Retry-After
      if (response.status === 429) {
        const retryAfter = parseInt(response.headers.get("Retry-After")) * 1000;
        console.log(` Rate limit. Waiting ${retryAfter}ms...`);
        await new Promise(r => setTimeout(r, retryAfter));
        continue;
      }

      if (!response.ok) throw new Error("HTTP error " + response.status);
      return await response.json();
    } catch (err) {
      clearTimeout(timeout);
      console.log(` Error: ${err.message}. Attempt ${i + 1} of ${retries}`);

      if (i < retries - 1) {
        const jitter = Math.random() * 200;
        await new Promise(r => setTimeout(r, delay + jitter));
        delay *= 2; // експоненційний backoff
      } else {
        throw err;
      }
    }
  }
}

// Degraded mode: після 3 поспіль помилок
let errorCount = 0;

async function safeRequest() {
  try {
    const result = await fetchWithRetry("http://localhost:3000/process", {
      method: "POST",
      headers: { "Idempotency-Key": "test-123" }
    });
    console.log(" Success:", result);
    errorCount = 0;
  } catch (err) {
    errorCount++;
    console.log(" Request failed:", err.message);

    if (errorCount >= 3) {
      console.log(" Degraded mode activated: кнопки тимчасово дизейблені, показати банер.");
    }
  }
}

// Запуск тесту
safeRequest();