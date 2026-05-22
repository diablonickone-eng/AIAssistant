const prisma = require('../lib/prisma');

const getAll = async (req, res, next) => {
  try {
    const reminders = await prisma.reminder.findMany({
      where: { userId: req.userId, isSent: false },
      include: { schedule: true, task: true },
      orderBy: { remindAt: 'asc' },
    });
    res.json(reminders);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { scheduleId, taskId, remindAt, type } = req.body;
    const reminder = await prisma.reminder.create({
      data: {
        userId: req.userId,
        scheduleId,
        taskId,
        remindAt: new Date(remindAt),
        type: type || 'notification',
      },
    });
    res.status(201).json(reminder);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.reminder.deleteMany({ where: { id, userId: req.userId } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, create, remove };
