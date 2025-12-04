import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';

import { TASK_COLUMNS } from '../constants/tasks';

const COLUMNS = TASK_COLUMNS;

const TaskBoard = ({ tasks, onTaskMove, onTaskClick }) => {
    const onDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const task = tasks.find(t => String(t.id) === draggableId);
        if (task && task.status !== destination.droppableId) {
            onTaskMove(task.id, destination.droppableId);
        }
    };

    const getTasksByStatus = (status) => {
        return tasks.filter(task => task.status === status);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 h-full">
                {Object.entries(COLUMNS).map(([statusKey, title]) => (
                    <div key={statusKey} className="flex-1 min-w-[300px] bg-gray-50 rounded-xl p-4 flex flex-col h-full max-h-full">
                        <h2 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
                            {title}
                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                                {getTasksByStatus(statusKey).length}
                            </span>
                        </h2>

                        <Droppable droppableId={statusKey}>
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={`flex-1 overflow-y-auto min-h-[100px] transition-colors rounded-lg ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
                                        }`}
                                >
                                    {getTasksByStatus(statusKey).map((task, index) => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            index={index}
                                            onClick={onTaskClick}
                                        />
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
    );
};

export default TaskBoard;
