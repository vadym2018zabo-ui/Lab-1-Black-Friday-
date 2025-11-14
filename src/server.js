const express = require("express");
const bodyParser = require("body-parser");
const { randomUUID } = require("crypto");
const { checkIdempotency, saveResult } = require("./utils/idempotencyStore");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(bodyParser.json());

// Middleware для X-Request-Id
app.use((req, res, next) => {
  const requestId = randomUUID();
  res.setHeader("X-Request-Id", requestId);
  req.requestId = requestId;
  next();
});

// Ліміт запитів (для 429 + Retry-After)
let requestCount = 0;
const LIMIT = 5;

// POST операція з ідемпотентністю
app.post("/process", async (req, res, next) => {
  try {
    requestCount++;
    if (requestCount > LIMIT) {
      res.setHeader("Retry-After", "3"); // клієнт чекає 3с
      return res.status(429).json({
        error: true,
        code: "RATE_LIMIT",
        message: "Too many requests",
        requestId: req.requestId
      });
    }

    const key = req.headers["idempotency-key"];
    if (!key) {
      return res.status(400).json({
        error: true,
        code: "NO_KEY",
        message: "Missing Idempotency-Key",
        requestId: req.requestId
      });
    }

    const cached = checkIdempotency(key);
    if (cached) {
      return res.json(cached);
    }

    // Симуляція довгої операції
    await new Promise(resolve => setTimeout(resolve, 1000));

    const result = { status: "ok", data: { id: Date.now() }, requestId: req.requestId };
    saveResult(key, result);

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// Health-check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Middleware для помилок
app.use(errorHandler);

app.listen(3000, () => console.log("Server running on http://localhost:3000"));