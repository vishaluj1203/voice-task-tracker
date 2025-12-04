import { useState } from 'react';

export const useViewState = () => {
    const [viewMode, setViewMode] = useState('board');
    const [searchQuery, setSearchQuery] = useState('');

    return {
        viewMode,
        setViewMode,
        searchQuery,
        setSearchQuery
    };
};
