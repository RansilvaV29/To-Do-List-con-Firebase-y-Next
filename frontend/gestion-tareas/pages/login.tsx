// pages/login.tsx
import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../lib/firebaseConfig';
import { useRouter } from 'next/router';
import styles from '../styles/TaskManager.module.css';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        try {
            await signInWithPopup(auth, provider);
            router.push('/'); // Redirigir a la página principal después del inicio de sesión
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div >
            <h1 className={styles.heading}>Iniciar sesión</h1>
            <button className={styles.loginButton} onClick={handleLogin} disabled={loading}>
                {loading ? 'Cargando...' : 'Iniciar sesión con Google'}
            </button>
        </div>
    );
}
