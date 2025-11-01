const express = require('express');
const resourceController = require('./api/resourceController');

const app = express();
app.use(express.json());

// Mount API
app.use('/', resourceController);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Monolith app running on http://localhost:${PORT}`);
});
