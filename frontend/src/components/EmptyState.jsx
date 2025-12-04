import { Search } from 'lucide-react';

const EmptyState = ({ onClear, hasFilters }) => {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
                <Search size={32} />
            </div>
            <p className="text-lg font-medium">No tasks found</p>
            <p className="text-sm">Try adjusting your filters or search query</p>
            {hasFilters && (
                <button
                    onClick={onClear}
                    className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    Clear all filters
                </button>
            )}
        </div>
    );
};

export default EmptyState;
