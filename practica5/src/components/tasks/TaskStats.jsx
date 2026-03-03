import { useTaskStore } from '../../store/taskStore';
import { isoverdue } from '../../utils/dateHelpers';

export default function TaskStats() {
    const tasks = useTaskStore((state) => state.tasks);

    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(t => isoverdue(t.dueDate, t.completed)).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="card text-center p-4">
                <p className="text-gray-500 text-sm">Total</p>
                <p className="text-2xl font-bold text-blue-600">{total}</p>
            </div>
            <div className="card text-center p-4">
                <p className="text-gray-500 text-sm">Completadas</p>
                <p className="text-2xl font-bold text-green-600">{completed}</p>
            </div>
            <div className="card text-center p-4">
                <p className="text-gray-500 text-sm">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-600">{pending}</p>
            </div>
            <div className="card text-center p-4">
                <p className="text-gray-500 text-sm">Vencidas</p>
                <p className="text-2xl font-bold text-red-600">{overdue}</p>
            </div>
            <div className="card text-center p-4">
                <p className="text-gray-500 text-sm">Progreso</p>
                <p className="text-2xl font-bold text-indigo-600">{percentage}%</p>
            </div>
        </div>
    );
}