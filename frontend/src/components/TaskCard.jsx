import { Draggable } from '@hello-pangea/dnd';
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
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

const TaskCard = ({ task, index, onClick }) => {
    return (
        <Draggable draggableId={String(task.id)} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => onClick(task)}
                    className={`bg-white p-4 rounded-lg shadow-sm mb-3 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400 rotate-2' : ''
                        }`}
                    style={provided.draggableProps.style}
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-800 line-clamp-2">{task.title}</h3>
                        <PriorityIcon priority={task.priority} />
                    </div>

                    {task.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>
                    )}

                    <div className="flex items-center text-xs text-gray-400 mt-2">
                        {task.dueDate && (
                            <div className="flex items-center mr-3">
                                <Calendar size={12} className="mr-1" />
                                <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                            </div>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${task.status === TASK_STATUS.DONE ? 'bg-green-100 text-green-700' :
                            task.status === TASK_STATUS.IN_PROGRESS ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-600'
                            }`}>
                            {task.status.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
