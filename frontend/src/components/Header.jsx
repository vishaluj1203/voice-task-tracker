import { Search, CheckCircle2, Filter, X, Kanban, List, Plus } from 'lucide-react';
import { TASK_STATUS, TASK_PRIORITY } from '../constants/tasks';

const Header = ({
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    dueDateFilter,
    setDueDateFilter,
    clearFilters,
    activeFiltersCount,
    viewMode,
    setViewMode,
    onCreateTask
}) => {
    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-200">
                        <CheckCircle2 size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                            VoiceTask
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center bg-slate-100/80 hover:bg-slate-100 transition-colors rounded-xl px-4 py-2.5 w-64 lg:w-80 border border-transparent focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100">
                        <Search size={18} className="text-slate-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                                <X size={14} />
                            </button>
                        )}
                    </div>

                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2.5 rounded-xl transition-all relative ${showFilters || activeFiltersCount > 0
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent'
                            }`}
                        title="Filters"
                    >
                        <Filter size={20} />
                        {activeFiltersCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                        <button
                            onClick={() => setViewMode('board')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'board'
                                ? 'bg-white shadow-sm text-indigo-600'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                            title="Board View"
                        >
                            <Kanban size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                                ? 'bg-white shadow-sm text-indigo-600'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                            title="List View"
                        >
                            <List size={18} />
                        </button>
                    </div>

                    <button
                        onClick={onCreateTask}
                        className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95 font-medium"
                    >
                        <Plus size={18} />
                        <span>New Task</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            {showFilters && (
                <div className="border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
                            >
                                <option value="">All Statuses</option>
                                <option value={TASK_STATUS.TODO}>To Do</option>
                                <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                                <option value={TASK_STATUS.DONE}>Done</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority:</span>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
                            >
                                <option value="">All Priorities</option>
                                <option value={TASK_PRIORITY.LOW}>Low</option>
                                <option value={TASK_PRIORITY.MEDIUM}>Medium</option>
                                <option value={TASK_PRIORITY.HIGH}>High</option>
                                <option value={TASK_PRIORITY.URGENT}>Urgent</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Due Date:</span>
                            <input
                                type="date"
                                value={dueDateFilter}
                                onChange={(e) => setDueDateFilter(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
                            />
                        </div>

                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-500 hover:text-red-700 font-medium ml-auto flex items-center gap-1"
                            >
                                <X size={14} /> Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
