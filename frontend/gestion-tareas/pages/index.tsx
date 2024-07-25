// pages/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/TaskManager.module.css';

interface Task {
    id: string;
    name: string;
    description: string;
    creationDate: string;
    priority: string;
    status: string;
}

const priorityOptions = ['alta', 'baja'];
const statusOptions = ['pendiente', 'activo', 'inactivo'];

export default function Home() {
    const { user, loading } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<Partial<Task>>({
        name: '',
        description: '',
        creationDate: '',
        priority: 'baja',
        status: 'pendiente'
    });
    const [editTask, setEditTask] = useState<Task | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login'); // Redirigir a la página de inicio de sesión si no está autenticado
        } else {
            fetchTasks();
        }
    }, [user, loading, router]);

    const fetchTasks = async () => {
        const response = await fetch('/api/tareas');
        const data = await response.json();
        setTasks(data);
    };

    const createTask = async () => {
        const response = await fetch('/api/tareas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTask),
        });
        const data = await response.json();
        setNewTask({
            name: '',
            description: '',
            creationDate: '',
            priority: 'baja',
            status: 'pendiente'
        });
        fetchTasks();
    };

    const deleteTask = async (id: string) => {
        await fetch(`/api/tareas/${id}`, {
            method: 'DELETE',
        });
        fetchTasks();
    };

    const updateTask = async () => {
        if (editTask) {
            await fetch(`/api/tareas/${editTask.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editTask),
            });
            setEditTask(null);
            fetchTasks();
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/login');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Gestión de Tareas</h1>
            <button onClick={handleLogout} className={styles.logoutButton}>
                Cerrar sesión
            </button>

            <div className={styles.form}>
                <h2>Crear Tarea</h2>
                <div>
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={newTask.name || ''}
                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Descripción"
                        value={newTask.description || ''}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    />
                    <input
                        type="date"
                        placeholder="Fecha de Creación"
                        value={newTask.creationDate || ''}
                        onChange={(e) => setNewTask({ ...newTask, creationDate: e.target.value })}
                    />
                    <select
                        value={newTask.priority || 'baja'}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                        {priorityOptions.map(option => (
                            <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                        ))}
                    </select>
                    <select
                        value={newTask.status || 'pendiente'}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                    >
                        {statusOptions.map(option => (
                            <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
                <button onClick={createTask}>Crear Tarea</button>
            </div>

            {editTask && (
                <div className={styles.form}>
                    <h2>Editar Tarea</h2>
                    <div>
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={editTask.name || ''}
                            onChange={(e) => setEditTask({ ...editTask, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Descripción"
                            value={editTask.description || ''}
                            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Fecha de Creación"
                            value={editTask.creationDate || ''}
                            onChange={(e) => setEditTask({ ...editTask, creationDate: e.target.value })}
                        />
                        <select
                            value={editTask.priority || 'baja'}
                            onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                        >
                            {priorityOptions.map(option => (
                                <option key={option} value={option}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </option>
                            ))}
                        </select>
                        <select
                            value={editTask.status || 'pendiente'}
                            onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
                        >
                            {statusOptions.map(option => (
                                <option key={option} value={option}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={updateTask}>Actualizar Tarea</button>
                    <button onClick={() => setEditTask(null)}>Cancelar</button>
                </div>
            )}

            <ul className={styles.taskList}>
                {tasks.map((task) => (
                    <li key={task.id} className={styles.taskItem}>
                        <h2>{task.name}</h2>
                        <p>{task.description}</p>
                        <p>{task.creationDate}</p>
                        <p>Prioridad: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</p>
                        <p>Estado: {task.status.charAt(0).toUpperCase() + task.status.slice(1)}</p>
                        <button
                            onClick={() => setEditTask(task)}
                            className={`${styles.editButton} ${styles.taskItemButton}`}
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => deleteTask(task.id)}
                            className={`${styles.deleteButton} ${styles.taskItemButton}`}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
