import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const api = {
    getTasks: async (status, search, priority, dueDate) => {
        const params = {};
        if (status) params.status = status;
        if (search) params.search = search;
        if (priority) params.priority = priority;
        if (dueDate) params.dueDate = dueDate;

        const response = await axios.get(`${API_URL}/tasks`, { params });
        return response.data;
    },

    createTask: async (task) => {
        const response = await axios.post(`${API_URL}/tasks`, task);
        return response.data;
    },

    updateTask: async (id, task) => {
        const response = await axios.put(`${API_URL}/tasks/${id}`, task);
        return response.data;
    },

    deleteTask: async (id) => {
        await axios.delete(`${API_URL}/tasks/${id}`);
    },

    parseTask: async (text) => {
        const response = await axios.post(`${API_URL}/parse-task`, { text });
        return response.data;
    }
};
