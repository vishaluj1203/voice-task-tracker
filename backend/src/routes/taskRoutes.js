const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/tasks', taskController.getAllTasks);
router.post('/tasks', taskController.createTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
router.post('/parse-task', taskController.parseTaskFromText);

module.exports = router;
