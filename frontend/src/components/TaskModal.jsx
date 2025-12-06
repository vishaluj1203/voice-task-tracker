import { useState, useEffect } from 'react';
import { X, Calendar, AlertCircle, Type, AlignLeft, Flag, CheckCircle2, Clock } from 'lucide-react';
import { TASK_STATUS, TASK_PRIORITY } from '../constants/tasks';

const getInitialFormData = (data) => {
    if (!data) {
        return {
            title: '',
            description: '',
            status: TASK_STATUS.TODO,
            priority: TASK_PRIORITY.MEDIUM,
            dueDate: ''
        };
    }

    let dateStr = '';
    if (data.dueDate) {
        const date = new Date(data.dueDate);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
    }

    return {
        title: data.title || '',
        description: data.description || '',
        status: data.status || TASK_STATUS.TODO,
        priority: data.priority || TASK_PRIORITY.MEDIUM,
        dueDate: dateStr
    };
};

const TaskModal = ({ isOpen, onClose, onSave, initialData, isReview }) => {
    const [formData, setFormData] = useState(() => getInitialFormData(initialData));

    useEffect(() => {
        if (isOpen) {
            setFormData(getInitialFormData(initialData));
        }
    }, [isOpen, initialData]);



    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        let finalDate = null;
        if (formData.dueDate) {
            // Construct date using UTC components to match the "Fake UTC" strategy
            const [year, month, day] = formData.dueDate.split('-').map(Number);

            // Create UTC date at midnight
            const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));

            finalDate = date.toISOString();
        }

        const cleanedData = {
            ...formData,
            dueDate: finalDate
        };
        // Remove temporary dueTime field
        // delete cleanedData.dueTime; // No longer needed as dueTime is removed

        onSave(cleanedData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-white/20">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {isReview ? 'Review Parsed Task' : initialData?.id ? 'Edit Task' : 'New Task'}
                        </h2>
                        {isReview && (
                            <p className="text-xs text-indigo-600 font-medium mt-0.5 flex items-center gap-1">
                                <CheckCircle2 size={12} />
                                Extracted from voice input
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Type size={14} /> Title
                        </label>
                        <input
                            type="text"
                            required
                            className="input-field text-lg font-medium placeholder:font-normal"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="What needs to be done?"
                            autoFocus
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <AlignLeft size={14} /> Description
                        </label>
                        <textarea
                            className="input-field min-h-[100px] resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Add details about this task..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Priority */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Flag size={14} /> Priority
                            </label>
                            <div className="relative">
                                <select
                                    className="input-field appearance-none"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value={TASK_PRIORITY.LOW}>Low Priority</option>
                                    <option value={TASK_PRIORITY.MEDIUM}>Medium Priority</option>
                                    <option value={TASK_PRIORITY.HIGH}>High Priority</option>
                                    <option value={TASK_PRIORITY.URGENT}>Urgent</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <AlertCircle size={14} /> Status
                            </label>
                            <div className="relative">
                                <select
                                    className="input-field appearance-none"
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value={TASK_STATUS.TODO}>To Do</option>
                                    <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                                    <option value={TASK_STATUS.DONE}>Done</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Due Date */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar size={14} /> Due Date
                        </label>
                        <input
                            type="date"
                            className="input-field"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                    </div>

                    {/* Footer */}
                    <div className="pt-6 flex justify-end gap-3 border-t border-slate-100 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary text-sm"
                        >
                            {isReview ? 'Create Task' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
