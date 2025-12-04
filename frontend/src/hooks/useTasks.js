import { useState, useCallback, useEffect } from 'react';
import { api } from '../api/index';

export const useTasks = (filters) => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { status, priority, dueDate, search } = filters;

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await api.getTasks(
                status || undefined,
                search || undefined,
                priority || undefined,
                dueDate || undefined
            );
            setTasks(data);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
            setError('Failed to fetch tasks');
        } finally {
            setIsLoading(false);
        }
    }, [status, search, priority, dueDate]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const createTask = async (taskData) => {
        try {
            const newTask = await api.createTask(taskData);
            setTasks(prev => [newTask, ...prev]);
            return newTask;
        } catch (err) {
            console.error('Failed to create task', err);
            throw err;
        }
    };

    const updateTask = async (id, taskData) => {
        try {
            const updatedTask = await api.updateTask(id, taskData);
            setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
            return updatedTask;
        } catch (err) {
            console.error('Failed to update task', err);
            throw err;
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.deleteTask(id);
            setTasks(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error('Failed to delete task', err);
            throw err;
        }
    };

    const moveTask = async (taskId, newStatus) => {
        // Optimistic update
        setTasks(prev => prev.map(t =>
            t.id === taskId ? { ...t, status: newStatus } : t
        ));

        try {
            await api.updateTask(taskId, { status: newStatus });
        } catch (err) {
            console.error('Failed to move task', err);
            // Revert on failure (could be improved by refetching or storing previous state)
            fetchTasks();
        }
    };

    const parseTask = async (transcript) => {
        try {
            return await api.parseTask(transcript);
        } catch (err) {
            console.error('Failed to parse task', err);
            throw err;
        }
    };

    return {
        tasks,
        isLoading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
        parseTask
    };
};
