import { prisma } from '../server.js';

// Category Controllers
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories.' });
  }
};


// Tag Controllers
export const getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({ where: { userId: req.user.userId } });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tags.' });
  }
};

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await prisma.tag.create({
      data: { name, userId: req.user.userId }
    });
    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Error creating tag.' });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.tag.delete({
      where: { id, userId: req.user.userId }
    });
    res.json({ message: 'Tag deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting tag.' });
  }
};
