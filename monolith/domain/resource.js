class Resource {
  constructor(id, name, value) {
    if (!id || !name) {
      throw new Error('Invalid Resource: id and name are required');
    }
    this.id = String(id);
    this.name = String(name);
    this.value = typeof value === 'number' ? value : Number(value) || 0;
  }
}

module.exports = Resource;
