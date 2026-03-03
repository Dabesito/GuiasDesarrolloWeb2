import { Link } from 'react-router-dom';
import { updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES } from '../../utils/constants';
import { getDueDateLabel, isoverdue } from '../../utils/dateHelpers';
import toast from 'react-hot-toast';

export default function TaskCard({ task }) {
    const category = CATEGORIES.find(c => c.id === task.category);
    const vencida = isoverdue(task.dueDate, task.completed);

    const handleToggleComplete = async (e) => {
        e.preventDefault();
        const result = await updateTask(task.id, { completed: !task.completed });
        if (result.success) toast.success(task.completed ? 'Tarea marcada como pendiente' : 'Tarea completada');
        else toast.error('Error al actualizar tarea');
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
            const result = await deleteTask(task.id);
            if (result.success) toast.success('Tarea eliminada');
            else toast.error('Error al eliminar tarea');
        }
    };

    return (
        <Link to={`/dashboard/tasks/${task.id}`} className="block">
            <div className={`card hover:shadow-lg transition-shadow border-l-4 ${task.completed ? 'opacity-60 border-gray-300' : ''} ${vencida ? 'border-red-500' : 'border-blue-500'}`}>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className={`text-xl font-bold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {task.title}
                        </h3>
                        {task.description && <p className="text-gray-600 mt-1 line-clamp-2">{task.description}</p>}
                        
                        <div className="flex gap-2 mt-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-${category?.color}-100 text-${category?.color}-800`}>
                                {category?.label}
                            </span>
                            {task.dueDate && (
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${vencida ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {getDueDateLabel(task.dueDate)}
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <button onClick={handleToggleComplete} className={`px-3 py-1 rounded text-sm text-white ${task.completed ? 'bg-gray-400 hover:bg-gray-500' : 'bg-green-500 hover:bg-green-600'}`}>
                            {task.completed ? 'Desmarcar' : 'Completar'}
                        </button>
                        <button onClick={handleDelete} className="px-3 py-1 rounded text-sm text-white bg-red-500 hover:bg-red-600">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
}