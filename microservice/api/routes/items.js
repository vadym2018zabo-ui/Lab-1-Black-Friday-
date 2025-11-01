const express = require('express');
const router = express.Router();
let items = [];

// CRUD
router.get('/', (req, res) => res.json(items));
router.get('/:id', (req, res) => {
  const item = items.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not Found', message: 'Item not found' });
  res.json(item);
});
router.post('/', (req, res) => {
  const { id, name, price } = req.body;
  if (!id || !name) return res.status(400).json({ error: 'Bad Request', message: 'id і name обов’язкові' });
  const newItem = { id, name, price: Number(price) || 0 };
  items.push(newItem);
  res.status(201).json(newItem);
});
router.put('/:id', (req, res) => {
  const index = items.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not Found', message: 'Item not found' });
  items[index] = { ...items[index], ...req.body };
  res.json(items[index]);
});
router.delete('/:id', (req, res) => {
  const index = items.findIndex(i => i.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not Found', message: 'Item not found' });
  items.splice(index, 1);
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;