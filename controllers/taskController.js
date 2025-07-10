const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      userId: req.user.id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { status, dueDate, page = 1, limit = 5 } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;
    if (dueDate) where.dueDate = dueDate;

    const offset = (page - 1) * limit;

    const tasks = await Task.findAndCountAll({
      where,
      offset: +offset,
      limit: +limit,
      order: [['dueDate', 'ASC']]
    });

    res.status(200).json({
      total: tasks.count,
      tasks: tasks.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.update(req.body);
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.destroy();
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
