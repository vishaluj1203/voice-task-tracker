const taskService = require('../services/taskService');
const { parseTask } = require('../services/parserService');

const getAllTasks = async (req, res) => {
    try {
        const tasks = await taskService.getTasks(req.query);
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
};

const createTask = async (req, res) => {
    try {
        const task = await taskService.createTask(req.body);
        res.json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await taskService.updateTask(req.params.id, req.body);
        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
};

const deleteTask = async (req, res) => {
    try {
        await taskService.deleteTask(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

const parseTaskFromText = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const parsedData = parseTask(text);
        res.json(parsedData);
    } catch (error) {
        console.error('Error parsing task:', error);
        res.status(500).json({ error: 'Failed to parse task' });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask,
    parseTaskFromText
};
