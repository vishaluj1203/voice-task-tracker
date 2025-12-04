import { useState, useCallback } from 'react';

export const useDeleteModal = () => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);

    const confirmDeleteTask = useCallback((id) => {
        setTaskToDelete(id);
        setIsDeleteModalOpen(true);
    }, []);

    const closeDeleteModal = useCallback(() => {
        setIsDeleteModalOpen(false);
        setTaskToDelete(null);
    }, []);

    return {
        isDeleteModalOpen,
        taskToDelete,
        confirmDeleteTask,
        closeDeleteModal
    };
};
