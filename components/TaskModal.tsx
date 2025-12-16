import React, { useState, useEffect } from "react";
import { Task, TaskPriority } from "../types";
import { Button } from "./Button";
import { Input } from "./Input";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    title: string,
    description: string,
    startDate?: string,
    endDate?: string,
    priority?: string,
    tags?: string[],
  ) => Promise<void>;
  initialData?: Task;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      // Format for datetime-local: YYYY-MM-DDThh:mm
      const safeStartDate =
        initialData.start_date &&
        !isNaN(new Date(initialData.start_date).getTime())
          ? new Date(initialData.start_date).toISOString().slice(0, 16)
          : "";
      setStartDate(safeStartDate);

      const safeEndDate =
        initialData.end_date && !isNaN(new Date(initialData.end_date).getTime())
          ? new Date(initialData.end_date).toISOString().slice(0, 16)
          : "";
      setEndDate(safeEndDate);
      setPriority(initialData.priority || TaskPriority.MEDIUM);
      setTags(initialData.tags || []);
    } else {
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setPriority(TaskPriority.MEDIUM);
      setTags([]);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      await onSubmit(
        title,
        description,
        startDate || undefined,
        endDate || undefined,
        priority,
        tags,
      );
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={onClose}
          ></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    {initialData ? "Editar Tarefa" : "Criar Nova Tarefa"}
                  </h3>
                  <div className="mt-4 space-y-4">
                    <Input
                      label="Título"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Digite o título da tarefa"
                      required
                      autoFocus
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descrição
                      </label>
                      <textarea placeholder="Digite a descrição da tarefa (opcional)" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data de Início
                        </label>
                        <input
                          type="datetime-local"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Data de Término
                        </label>
                        <input
                          type="datetime-local"
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                isLoading={loading}
                className="w-full sm:w-auto sm:ml-3"
              >
                {initialData ? "Salvar Alterações" : "Criar Tarefa"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="mt-3 w-full sm:mt-0 sm:w-auto"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
