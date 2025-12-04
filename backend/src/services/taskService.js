const prisma = require('../models');

const getTasks = async (filters = {}) => {
    const { status, priority, dueDate, search } = filters;
    const where = {};

    if (status) {
        where.status = status;
    }

    if (priority) {
        where.priority = priority;
    }

    if (dueDate) {
        const start = new Date(dueDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(dueDate);
        end.setHours(23, 59, 59, 999);

        where.dueDate = {
            gte: start,
            lte: end
        };
    }

    if (search) {
        where.OR = [
            { title: { contains: search } },
            { description: { contains: search } }
        ];
    }

    return await prisma.task.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    });
};

const createTask = async (data) => {
    const { title, description, status, priority, dueDate } = data;
    return await prisma.task.create({
        data: {
            title,
            description,
            status: status || 'TODO',
            priority: priority || 'MEDIUM',
            dueDate: dueDate && dueDate !== '' && dueDate !== 'null' ? new Date(dueDate) : null
        }
    });
};

const updateTask = async (id, data) => {
    const { title, description, status, priority, dueDate } = data;
    return await prisma.task.update({
        where: { id: parseInt(id) },
        data: {
            title,
            description,
            status,
            priority,
            dueDate: dueDate && dueDate !== '' && dueDate !== 'null' ? new Date(dueDate) : null
        }
    });
};

const deleteTask = async (id) => {
    return await prisma.task.delete({
        where: { id: parseInt(id) }
    });
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};
