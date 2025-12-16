import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanTaskCard } from "./KanbanTaskCard";
import { Task, TaskStatus } from "../types";

interface Props {
  tasks: Task[];
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const KanbanBoard: React.FC<Props> = ({
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid accidental drags for clicks
      },
    }),
  );

  const pendingTasks = tasks.filter((t) => t.status === TaskStatus.PENDING);
  const completedTasks = tasks.filter((t) => t.status === TaskStatus.COMPLETED);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    // Determine target column based on where it was dropped
    // 'over.id' could be a container ID (pending/completed) or another tas item ID
    // If dropped on a container:
    let newStatus: TaskStatus | null = null;
    if (over.id === "pending") newStatus = TaskStatus.PENDING;
    else if (over.id === "completed") newStatus = TaskStatus.COMPLETED;
    else {
      // If dropped over another task, find that task's status
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask && overTask.status !== activeTask.status) {
        newStatus = overTask.status;
      }
    }

    if (newStatus && newStatus !== activeTask.status) {
      onStatusChange(activeTask.id, newStatus);
    }

    setActiveId(null);
  };

  const activeTask = activeId ? tasks.find((t) => t.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)] overflow-x-auto pb-4">
        <KanbanColumn
          id="pending"
          title="Pendentes"
          tasks={pendingTasks}
          statusColor="bg-yellow-400"
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <KanbanColumn
          id="completed"
          title="Concluídas"
          tasks={completedTasks}
          statusColor="bg-green-500"
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <DragOverlay>
        {activeTask ? (
          <KanbanTaskCard
            task={activeTask}
            onEdit={() => {}} // No-op during drag
            onDelete={() => {}} // No-op during drag
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
