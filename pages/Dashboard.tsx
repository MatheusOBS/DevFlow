import React, { useEffect, useState } from "react";
import { taskService } from "../services/api";
import { Task, TaskStatus } from "../types";
import { Button } from "../components/Button";
import { TaskModal } from "../components/TaskModal";
import { KanbanBoard } from "../components/KanbanBoard";
import { StatsView } from "../components/StatsView";

export const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [viewMode, setViewMode] = useState<"list" | "board" | "stats">("board");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await taskService.getAll();
      setTasks(data);
    } catch (error) {
      console.error("Falha ao buscar tarefas", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (
    title: string,
    description: string,
    startDate?: string,
    endDate?: string,
  ) => {
    try {
      if (editingTask) {
        // Edit mode usually doesn't create new notes with dates in this simple flow, or we need to update update method too.
        // For now let's focus on create as per request. If update needs dates, we'd need to update that signature too.
        // The modal passes all 4 args.
        const updated = await taskService.update(editingTask.id, {
          title,
          description,
          start_date: startDate,
          end_date: endDate,
        });
        setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await taskService.create(
          title,
          description,
          startDate,
          endDate,
        );
        setTasks([created, ...tasks]);
      }
      setEditingTask(undefined);
    } catch (error: any) {
      console.error("Erro ao salvar tarefa:", error);
      alert(`Erro ao salvar tarefa: ${error.message || "Erro desconhecido"}`);
    }
  };

  const handleToggleStatus = async (task: Task) => {
    // When handling toggles from list view
    await updateTaskStatus(
      task.id,
      task.status === TaskStatus.PENDING
        ? TaskStatus.COMPLETED
        : TaskStatus.PENDING,
    );
  };

  const updateTaskStatus = async (id: string, newStatus: TaskStatus) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    // Otimistic update
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));

    try {
      await taskService.update(id, { status: newStatus });
    } catch (e: any) {
      // Revert on fail
      setTasks(tasks.map((t) => (t.id === id ? task : t)));
      console.error("Falha ao atualizar", e);
      alert(`Falha ao atualizar status: ${e.message || "Erro desconhecido"}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;
    try {
      await taskService.delete(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (e: any) {
      console.error("Falha ao excluir", e);
      alert(`Falha ao excluir tarefa: ${e.message || "Erro desconhecido"}`);
    }
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const filteredTasks = (tasks || []).filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
    pending: tasks.filter((t) => t.status === TaskStatus.PENDING).length,
  };

  const getFilterLabel = (f: string) => {
    switch (f) {
      case "all":
        return "Todas";
      case "pending":
        return "Pendentes";
      case "completed":
        return "Concluídas";
      default:
        return f;
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho & Estatísticas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Você tem {stats.pending} tarefas pendentes de um total de{" "}
            {stats.total}.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Nova Tarefa
        </Button>
      </div>

      {/* Abas de Filtro e Toggle de Visualização */}
      <div className="flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {(["all", "pending", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              disabled={viewMode === "board"}
              className={`${
                filter === f
                  ? "border-brand-500 text-brand-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } ${viewMode === "board" ? "opacity-50 cursor-not-allowed" : ""} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {getFilterLabel(f)}
            </button>
          ))}
        </nav>
        <div className="flex items-center space-x-2 py-2 sm:py-0">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${viewMode === "list" ? "bg-gray-200 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
            title="Lista"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("board")}
            className={`p-2 rounded ${viewMode === "board" ? "bg-gray-200 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
            title="Quadro"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("stats")}
            className={`p-2 rounded ${viewMode === "stats" ? "bg-gray-200 text-gray-900" : "text-gray-500 hover:text-gray-900"}`}
            title="Estatísticas"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Lista de Tarefas ou Quadro */}
      <div key={viewMode} className="animate-fade-in">
        {loading ? (
          <div className="flex justify-center py-12">
            {/* ... spinner (mantido) ... */}
            <svg
              className="animate-spin h-8 w-8 text-brand-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        ) : viewMode === "board" ? (
          <KanbanBoard
            tasks={tasks} // Pass all tasks, filters don't apply to board cols usually, or we can apply them if needed. Usually board shows all.
            onStatusChange={updateTaskStatus}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        ) : viewMode === "stats" ? (
          <StatsView tasks={tasks} />
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Nenhuma tarefa encontrada
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece criando uma nova tarefa.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white rounded-lg border p-5 transition-shadow hover:shadow-md ${task.status === TaskStatus.COMPLETED ? "border-gray-200 bg-gray-50" : "border-gray-200"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-medium ${task.status === TaskStatus.COMPLETED ? "text-gray-500 line-through" : "text-gray-900"}`}
                    >
                      {task.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm ${task.status === TaskStatus.COMPLETED ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {task.description || "Nenhuma descrição fornecida."}
                    </p>
                  </div>
                  <div className="ml-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.status === TaskStatus.COMPLETED
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.status === TaskStatus.COMPLETED
                        ? "Concluída"
                        : "Pendente"}
                    </span>
                    {(task.start_date || task.end_date) && (
                      <div className="mt-2 flex flex-col items-end text-xs text-gray-500 space-y-1">
                        {task.start_date &&
                          !isNaN(new Date(task.start_date).getTime()) && (
                            <span>
                              Início:{" "}
                              {new Date(task.start_date).toLocaleString(
                                "pt-BR",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          )}
                        {task.end_date &&
                          !isNaN(new Date(task.end_date).getTime()) && (
                            <span>
                              Fim:{" "}
                              {new Date(task.end_date).toLocaleString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <button
                    onClick={() => handleToggleStatus(task)}
                    className={`text-sm font-medium ${task.status === TaskStatus.COMPLETED ? "text-gray-500 hover:text-gray-700" : "text-brand-600 hover:text-brand-800"}`}
                  >
                    {task.status === TaskStatus.COMPLETED
                      ? "Marcar pendente"
                      : "Concluir"}
                  </button>
                  <div className="flex space-x-3">
                    {(task.start_date || task.end_date) && (
                      <a
                        href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task.title)}&details=${encodeURIComponent(task.description)}&dates=${
                          task.start_date
                            ? new Date(task.start_date)
                                .toISOString()
                                .replace(/-|:|\.\d\d\d/g, "")
                            : ""
                        }/${
                          task.end_date
                            ? new Date(task.end_date)
                                .toISOString()
                                .replace(/-|:|\.\d\d\d/g, "")
                            : ""
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-green-600 transition-colors"
                        title="Adicionar ao Google Agenda"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </a>
                    )}
                    <button
                      onClick={() => openEditModal(task)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg
                        className="h-5 w-5"
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
              </div>
            ))}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        initialData={editingTask}
      />
    </div>
  );
};
