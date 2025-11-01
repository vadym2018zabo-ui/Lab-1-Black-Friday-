const express = require('express');
const router = express.Router();
const service = require('../service/resourceService');

// GET /health
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// POST /resource
router.post('/resource', (req, res) => {
  try {
    const resource = service.createResource(req.body);
    return res.status(201).json(resource);
  } catch (err) {
    return res.status(400).json({ error: 'Bad Request', message: err.message });
  }
});

// GET /resource
router.get('/resource', (req, res) => {
  const list = service.getAllResources();
  res.json(list);
});

// GET /resource/:id
router.get('/resource/:id', (req, res) => {
  const resource = service.getResourceById(req.params.id);
  if (!resource) return res.status(404).json({ error: 'Not Found', message: 'Resource not found' });
  res.json(resource);
});

// PUT /resource/:id
router.put('/resource/:id', (req, res) => {
  try {
    const updated = service.updateResource(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Not Found', message: 'Resource not found' });
    res.json(updated);
  } catch (err) {
    return res.status(400).json({ error: 'Bad Request', message: err.message });
  }
});

// DELETE /resource/:id
router.delete('/resource/:id', (req, res) => {
  const deleted = service.deleteResource(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Not Found', message: 'Resource not found' });
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
