import * as Craft from '../models/craft.model.js';

async function listCrafts(req, res) {
	try {
		const data = await Craft.findAll();
		res.json(data);
	} catch (err) {
		console.error('[CRAFT] listCrafts error', err);
		res.status(500).json({ error: 'Failed to list crafts' });
	}
}

async function getCraft(req, res) {
	const { id } = req.params;
	try {
		const craft = await Craft.findById(id);
		if (!craft) return res.status(404).json({ error: 'Craft not found' });
		return res.json(craft);
	} catch (err) {
		console.error('[CRAFT] getCraft error', err);
		return res.status(500).json({ error: 'Failed to get craft' });
	}
}

async function createCraft(req, res) {
	const { title, description, price, stock } = req.body || {};
	if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
	if (!title || typeof price === 'undefined') return res.status(400).json({ error: 'title and price required' });
	try {
		const c = await Craft.create({ title, description, price, userId: req.user.id, stock });
		res.status(201).json(c);
	} catch (err) {
		console.error('[CRAFT] createCraft error', err);
		res.status(500).json({ error: 'Failed to create craft' });
	}
}

async function updateCraft(req, res) {
	const { id } = req.params;
	const { title, description, price, stock } = req.body || {};
	if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
	if (!title || typeof price === 'undefined') return res.status(400).json({ error: 'title and price required' });
	try {
		const craft = await Craft.findById(id);
		if (!craft) return res.status(404).json({ error: 'Craft not found' });
		if (craft.seller_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

		const updated = await Craft.update(id, { title, description, price, stock });
		return res.json(updated);
	} catch (err) {
		console.error('[CRAFT] updateCraft error', err);
		return res.status(500).json({ error: 'Failed to update craft' });
	}
}

async function deleteCraft(req, res) {
	const { id } = req.params;
	if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
	try {
		const craft = await Craft.findById(id);
		if (!craft) return res.status(404).json({ error: 'Craft not found' });
		if (craft.seller_id !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

		const ok = await Craft.remove(id);
		if (!ok) return res.status(500).json({ error: 'Delete failed' });
		return res.json({ message: 'Craft deleted' });
	} catch (err) {
		console.error('[CRAFT] deleteCraft error', err);
		return res.status(500).json({ error: 'Failed to delete craft' });
	}
}

export { listCrafts, getCraft, createCraft, updateCraft, deleteCraft };
