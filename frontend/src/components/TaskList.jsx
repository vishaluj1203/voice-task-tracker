import { Calendar, AlertCircle, CheckCircle, Clock, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { TASK_STATUS, TASK_PRIORITY } from '../constants/tasks';

const PriorityIcon = ({ priority }) => {
    switch (priority) {
        case TASK_PRIORITY.URGENT:
            return <AlertCircle className="text-red-500" size={16} />;
        case TASK_PRIORITY.HIGH:
            return <AlertCircle className="text-orange-500" size={16} />;
        case TASK_PRIORITY.LOW:
            return <CheckCircle className="text-green-500" size={16} />;
        default:
            return <Clock className="text-blue-500" size={16} />;
    }
};

const TaskList = ({ tasks, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-medium text-gray-800">{task.title}</div>
                                {task.description && <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.status === TASK_STATUS.DONE ? 'bg-green-100 text-green-700' :
                                    task.status === TASK_STATUS.IN_PROGRESS ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-gray-100 text-gray-600'
                                    }`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <PriorityIcon priority={task.priority} />
                                    <span className="text-sm text-gray-600 capitalize">{task.priority.toLowerCase()}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => onEdit(task)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => onDelete(task.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {tasks.length === 0 && (
                        <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                No tasks found. Create one to get started!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TaskList;
