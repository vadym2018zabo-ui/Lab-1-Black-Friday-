const express = require('express');
const itemsRouter = require('./api/routes/items');
const app = express();

app.use(express.json());
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/items', itemsRouter);

app.listen(3001, () => console.log('Мікросервіс працює на http://localhost:3001'));