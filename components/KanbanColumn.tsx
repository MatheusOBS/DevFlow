import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task } from "../types";
import { KanbanTaskCard } from "./KanbanTaskCard";

interface Props {
  id: string;
  title: string;
  tasks: Task[];
  statusColor: string;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const KanbanColumn: React.FC<Props> = ({
  id,
  title,
  tasks,
  statusColor,
  onEdit, // Receive onEdit
  onDelete, // Receive onDelete
}) => {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-lg p-4 min-w-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${statusColor}`}></span>
          {title}
        </h3>
        <span className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div ref={setNodeRef} className="flex-1 overflow-y-auto min-h-[100px]">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <KanbanTaskCard
              key={task.id}
              task={task}
              onEdit={onEdit} // Pass down
              onDelete={onDelete} // Pass down
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            Solte aqui
          </div>
        )}
      </div>
    </div>
  );
};
