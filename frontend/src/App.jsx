import React, { useCallback } from 'react';
import { Plus } from 'lucide-react';
import TaskBoard from './components/TaskBoard';
import TaskList from './components/TaskList';
import VoiceInput from './components/VoiceInput';
import TaskModal from './components/TaskModal';
import ConfirmationModal from './components/ConfirmationModal';
import Header from './components/Header';
import LoadingState from './components/LoadingState';
import EmptyState from './components/EmptyState';
import { useTasks } from './hooks/useTasks';
import { useViewState } from './hooks/useViewState';
import { useFilters } from './hooks/useFilters';
import { useTaskModal } from './hooks/useTaskModal';
import { useDeleteModal } from './hooks/useDeleteModal';

function App() {
  const { viewMode, setViewMode, searchQuery, setSearchQuery } = useViewState();

  const {
    statusFilter,
    priorityFilter,
    dueDateFilter,
    showFilters,
    setStatusFilter,
    setPriorityFilter,
    setDueDateFilter,
    setShowFilters,
    clearFilters,
    activeFiltersCount
  } = useFilters();

  const {
    isModalOpen,
    editingTask,
    isReviewMode,
    openModal,
    closeModal,
    openForEdit,
    openForReview
  } = useTaskModal();

  const {
    isDeleteModalOpen,
    taskToDelete,
    confirmDeleteTask,
    closeDeleteModal
  } = useDeleteModal();

  const {
    tasks,
    isLoading,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    parseTask
  } = useTasks({
    status: statusFilter,
    priority: priorityFilter,
    dueDate: dueDateFilter,
    search: searchQuery
  });

  const handleSaveTask = useCallback(async (taskData) => {
    try {
      if (editingTask && !isReviewMode) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save task', error);
    }
  }, [editingTask, isReviewMode, updateTask, createTask, closeModal]);

  const handleDeleteTask = useCallback(async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete);
        closeDeleteModal();
      } catch (error) {
        console.error('Failed to delete task', error);
      }
    }
  }, [taskToDelete, deleteTask, closeDeleteModal]);

  const handleVoiceTranscript = useCallback(async (transcript) => {
    try {
      const parsedData = await parseTask(transcript);
      const description = parsedData.description
        ? `${parsedData.description}\n\nTranscript: "${transcript}"`
        : `Transcript: "${transcript}"`;

      openForReview({ ...parsedData, description });
    } catch (error) {
      console.error('Failed to parse voice input', error);
      alert('Failed to process voice input. Please try again.');
    }
  }, [parseTask, openForReview]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (tasks.length === 0) {
      return (
        <EmptyState
          onClear={clearFilters}
          hasFilters={activeFiltersCount > 0 || searchQuery}
        />
      );
    }

    if (viewMode === 'board') {
      return (
        <TaskBoard
          tasks={tasks}
          onTaskMove={moveTask}
          onTaskClick={openForEdit}
        />
      );
    }

    return (
      <TaskList
        tasks={tasks}
        onEdit={openForEdit}
        onDelete={confirmDeleteTask}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        dueDateFilter={dueDateFilter}
        setDueDateFilter={setDueDateFilter}
        clearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onCreateTask={openModal}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden flex flex-col">
        {/* Mobile Search & Add Task */}
        <div className="md:hidden mb-6 space-y-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <input
              type="text"
              placeholder="Search tasks..."
              className="bg-transparent border-none outline-none text-sm w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={openModal}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl font-medium shadow-md"
          >
            <Plus size={18} />
            Add Task
          </button>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </main>

      {/* Floating Voice Input */}
      <div className="fixed bottom-8 right-8 z-40">
        <VoiceInput onTranscript={handleVoiceTranscript} />
      </div>

      {/* Task Modal */}
      <TaskModal
        key={editingTask ? editingTask.id : 'new-task'}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveTask}
        initialData={editingTask}
        isReview={isReviewMode}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        isDanger={true}
      />
    </div>
  );
}

export default App;
