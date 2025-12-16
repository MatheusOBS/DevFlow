import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task, TaskStatus } from "../types";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const KanbanTaskCard: React.FC<Props> = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group mb-3 touch-none`}
    >
      <div className="flex justify-between items-start">
        <h4
          className={`text-sm font-medium ${task.status === TaskStatus.COMPLETED ? "line-through text-gray-400" : "text-gray-900"}`}
        >
          {task.title}
        </h4>
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag start
              onEdit(task);
            }}
            className="text-gray-400 hover:text-blue-600 p-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag start
              onDelete(task.id);
            }}
            className="text-gray-400 hover:text-red-600 p-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
          {task.description}
        </p>
      )}
      {(task.start_date || task.end_date) && (
        <div className="mt-3 text-xs text-gray-400 flex flex-col gap-0.5">
          {task.start_date && !isNaN(new Date(task.start_date).getTime()) && (
            <span>
              Início: {new Date(task.start_date).toLocaleDateString("pt-BR")}
            </span>
          )}
          {task.end_date && !isNaN(new Date(task.end_date).getTime()) && (
            <span>
              Fim: {new Date(task.end_date).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
