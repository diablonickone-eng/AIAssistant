const prisma = require('../lib/prisma');

const getAll = async (req, res, next) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

const getPendingSummary = async (req, res, next) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const pending = await prisma.task.findMany({
      where: {
        userId: req.userId,
        status: 'pending',
        dueDate: { lt: new Date() },
      },
      orderBy: { dueDate: 'desc' },
    });
    res.json({ count: pending.length, tasks: pending });
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, dueDate, priority, notes } = req.body;
    const task = await prisma.task.create({
      data: {
        userId: req.userId,
        title,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'medium',
        notes,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, dueDate, priority, notes } = req.body;
    const updated = await prisma.task.updateMany({
      where: { id, userId: req.userId },
      data: {
        title,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority, notes,
      },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.task.deleteMany({ where: { id, userId: req.userId } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.task.updateMany({
      where: { id, userId: req.userId },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getPendingSummary, create, update, remove, updateStatus };
