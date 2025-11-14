const store = new Map();

function checkIdempotency(key) {
  return store.get(key);
}

function saveResult(key, result) {
  store.set(key, result);
}

module.exports = { checkIdempotency, saveResult };