import { prisma } from '../server.js';

export const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.userId },
      include: {
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks.' });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await prisma.task.findFirst({
      where: { id: req.params.id, userId: req.user.userId },
      include: { category: true, tags: true }
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task.' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, isCompleted, categoryId, tagIds } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'MEDIA',
        isCompleted: isCompleted || false,
        userId: req.user.userId,
        categoryId,
        tags: {
          connect: tagIds?.map((id) => ({ id })) || []
        }
      },
      include: { category: true, tags: true }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating task.' });
  }
};

export const updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, dueDate, priority, isCompleted, categoryId, tagIds } = req.body;
  
      const task = await prisma.task.update({
        where: { id, userId: req.user.userId },
        data: {
          title,
          description,
          dueDate: dueDate ? new Date(dueDate) : null,
          priority,
          isCompleted,
          categoryId,
          tags: tagIds ? {
            set: tagIds.map((tid) => ({ id: tid }))
          } : undefined
        },
        include: { category: true, tags: true }
      });
      res.json(task);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error updating task.' });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.task.delete({
            where: { id, userId: req.user.userId }
        });
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting task.' });
    }
};
