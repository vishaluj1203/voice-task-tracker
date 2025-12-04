import { useState, useCallback } from 'react';

export const useTaskModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [isReviewMode, setIsReviewMode] = useState(false);

    const openModal = useCallback(() => {
        setEditingTask(null);
        setIsReviewMode(false);
        setIsModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const openForEdit = useCallback((task) => {
        setEditingTask(task);
        setIsReviewMode(false);
        setIsModalOpen(true);
    }, []);

    const openForReview = useCallback((task) => {
        setEditingTask(task);
        setIsReviewMode(true);
        setIsModalOpen(true);
    }, []);

    return {
        isModalOpen,
        editingTask,
        isReviewMode,
        openModal,
        closeModal,
        openForEdit,
        openForReview
    };
};
