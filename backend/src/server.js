import express from 'express';
import cors from 'cors';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import authRoutes from './routes/authRoutes.js';

export const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

import dashboardRoutes from './routes/dashboardRoutes.js';
import metaRoutes from './routes/metaRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', metaRoutes); // will use /api/categories and /api/tags
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Productivity Dashboard API is running.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
