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
        // Manually parse YYYY-MM-DD to ensure strict UTC construction
        // This avoids any ambiguity with how new Date(string) is parsed
        const [year, month, day] = dueDate.split('-').map(Number);

        const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

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
    console.log(`[AUDIT] updateTask called for ID ${id} at ${new Date().toISOString()}`);
    console.log(`[AUDIT] updateTask payload:`, JSON.stringify(data, null, 2));

    // If we are updating dueDate, ensure we use the same manual parsing logic
    // to prevent timezone shifts if it's passed as a string
    let updateData = { ...data };

    if (updateData.dueDate && typeof updateData.dueDate === 'string') {
        const [year, month, day] = updateData.dueDate.split('T')[0].split('-').map(Number);
        // Set to UTC midnight
        updateData.dueDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    }

    return await prisma.task.update({
        where: { id: parseInt(id) },
        data: updateData
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
