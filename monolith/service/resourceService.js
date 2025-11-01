const Resource = require('../domain/resource');

let resources = [];

function validateInput(data) {
  if (!data) throw new Error('Body is required');
  const { id, name, value } = data;
  if (!id || !name) throw new Error('id and name are required');
  return { id, name, value };
}

function createResource(data) {
  const input = validateInput(data);
  const exists = resources.some(r => r.id === input.id);
  if (exists) throw new Error('Resource with this id already exists');
  const resource = new Resource(input.id, input.name, input.value);
  resources.push(resource);
  return resource;
}

function getAllResources() {
  return resources;
}

function getResourceById(id) {
  return resources.find(r => r.id === id);
}

function updateResource(id, data) {
  const index = resources.findIndex(r => r.id === id);
  if (index === -1) return null;
  const { name, value } = data || {};
  if (!name) throw new Error('name is required');
  resources[index] = new Resource(id, name, value);
  return resources[index];
}

function deleteResource(id) {
  const index = resources.findIndex(r => r.id === id);
  if (index === -1) return false;
  resources.splice(index, 1);
  return true;
}

module.exports = {
  createResource,
  getAllResources,
  getResourceById,
  updateResource,
  deleteResource
};
