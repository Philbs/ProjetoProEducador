import express from 'express';
import { prisma } from '../server.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Aggregate counts
    const totalTasks = await prisma.task.count({ where: { userId } });
    const completedTasks = await prisma.task.count({ where: { userId, isCompleted: true } });
    const pendingTasks = await prisma.task.count({ where: { userId, isCompleted: false } });
    
    // We no longer have 'IN_PROGRESS' formally, replacing it with pending but having no due date or just 0 to keep the UI shape for now
    const inProgressTasks = 0; 
    
    // Calculate overdue (pending tasks with a due date in the past)
    const overdueTasks = await prisma.task.count({
      where: {
        userId,
        isCompleted: false,
        dueDate: { lt: new Date() }
      }
    });

    // Recent tasks
    const recentTasks = await prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: true }
    });

    // Upcoming tasks
    const upcomingTasks = await prisma.task.findMany({
       where: {
         userId,
         isCompleted: false,
         dueDate: { gte: new Date() }
       },
       orderBy: { dueDate: 'asc' },
       take: 5
    });

    res.json({
      metrics: {
        total: totalTasks,
        completed: completedTasks,
        pending: pendingTasks,
        inProgress: inProgressTasks,
        overdue: overdueTasks,
      },
      recentTasks,
      upcomingTasks
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error while fetching dashboard data.' });
  }
});

export default router;
