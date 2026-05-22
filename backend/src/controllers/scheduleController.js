const prisma = require('../lib/prisma');

const getAll = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const where = { userId: req.userId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const schedules = await prisma.schedule.findMany({
      where,
      orderBy: { date: 'asc' },
    });
    res.json(schedules);
  } catch (err) {
    next(err);
  }
};

const getToday = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const schedules = await prisma.schedule.findMany({
      where: {
        userId: req.userId,
        date: { gte: today, lt: tomorrow },
      },
      orderBy: { startTime: 'asc' },
    });
    res.json(schedules);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { title, description, date, startTime, endTime, isRecurring, recurringRule } = req.body;
    const schedule = await prisma.schedule.create({
      data: {
        userId: req.userId,
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        isRecurring: isRecurring || false,
        recurringRule,
      },
    });

    // Auto-create reminder 15 menit sebelum
    const remindAt = new Date(`${date}T${startTime}`);
    remindAt.setMinutes(remindAt.getMinutes() - 15);

    await prisma.reminder.create({
      data: {
        userId: req.userId,
        scheduleId: schedule.id,
        remindAt,
        type: 'notification',
      },
    });

    res.status(201).json(schedule);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, date, startTime, endTime, isRecurring, recurringRule } = req.body;

    const schedule = await prisma.schedule.findFirst({
      where: { id, userId: req.userId },
    });
    if (!schedule) return res.status(404).json({ error: 'Schedule not found' });

    const updated = await prisma.schedule.update({
      where: { id },
      data: {
        title, description,
        date: date ? new Date(date) : undefined,
        startTime, endTime, isRecurring, recurringRule,
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
    await prisma.schedule.deleteMany({ where: { id, userId: req.userId } });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.schedule.updateMany({
      where: { id, userId: req.userId },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getToday, create, update, remove, updateStatus };
