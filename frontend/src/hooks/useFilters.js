import { useState, useMemo } from 'react';

export const useFilters = () => {
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        dueDate: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    const setStatusFilter = (status) => {
        setFilters(prev => ({ ...prev, status }));
    };

    const setPriorityFilter = (priority) => {
        setFilters(prev => ({ ...prev, priority }));
    };

    const setDueDateFilter = (dueDate) => {
        setFilters(prev => ({ ...prev, dueDate }));
    };

    const clearFilters = () => {
        setFilters({
            status: '',
            priority: '',
            dueDate: ''
        });
    };

    const activeFiltersCount = useMemo(() => {
        return [filters.status, filters.priority, filters.dueDate].filter(Boolean).length;
    }, [filters]);

    return {
        statusFilter: filters.status,
        priorityFilter: filters.priority,
        dueDateFilter: filters.dueDate,
        showFilters,
        setStatusFilter,
        setPriorityFilter,
        setDueDateFilter,
        setShowFilters,
        clearFilters,
        activeFiltersCount
    };
};
