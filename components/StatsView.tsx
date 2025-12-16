import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Task, TaskPriority, TaskStatus } from "../types";
import { useTheme } from "../context/ThemeContext";

interface Props {
  tasks: Task[];
}

export const StatsView: React.FC<Props> = ({ tasks }) => {
  const { theme } = useTheme();
  
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const pending = total - completed;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byPriority = [
      {
        name: "Alta",
        value: tasks.filter((t) => t.priority === TaskPriority.HIGH).length,
        color: "#EF4444",
      },
      {
        name: "Média",
        value: tasks.filter((t) => t.priority === TaskPriority.MEDIUM).length,
        color: "#F59E0B",
      },
      {
        name: "Baixa",
        value: tasks.filter((t) => t.priority === TaskPriority.LOW).length,
        color: "#10B981",
      },
    ];

    const byStatus = [
      { name: "Concluídas", value: completed, color: "#10B981" },
      { name: "Pendentes", value: pending, color: "#F59E0B" },
    ];

    return { total, completed, pending, rate, byPriority, byStatus };
  }, [tasks]);

  const textColor = theme === 'dark' ? '#E5E7EB' : '#374151';

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="text-sm font-medium text-gray-500">Total de Tarefas</h3>
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className={`p-4 rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="text-sm font-medium text-gray-500">Concluídas</h3>
          <p className="text-2xl font-bold mt-1 text-green-600">{stats.completed}</p>
        </div>
        <div className={`p-4 rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="text-sm font-medium text-gray-500">Pendentes</h3>
          <p className="text-2xl font-bold mt-1 text-yellow-600">{stats.pending}</p>
        </div>
        <div className={`p-4 rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="text-sm font-medium text-gray-500">Taxa de Conclusão</h3>
          <p className="text-2xl font-bold mt-1 text-brand-600">{stats.rate}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Chart */}
        <div className={`p-6 rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="text-lg font-medium mb-4">Status das Tarefas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.byStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.byStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Chart */}
        <div className={`p-6 rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h3 className="text-lg font-medium mb-4">Tarefas por Prioridade</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.byPriority}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                <XAxis dataKey="name" stroke={textColor} />
                <YAxis stroke={textColor} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    cursor={{fill: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}}
                />
                <Bar dataKey="value" name="Quantidade" radius={[4, 4, 0, 0]}>
                  {stats.byPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
