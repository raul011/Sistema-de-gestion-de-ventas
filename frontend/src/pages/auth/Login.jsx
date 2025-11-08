import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const { login, fetchUser, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(form);
      if (result?.success) {
        const currentUser = await fetchUser(); // obtiene el usuario actualizado
        if (currentUser?.role === 'Cliente') {
          navigate('/'); // página principal para clientes
        } else {
          navigate('/dashboard'); // dashboard para los demás roles
        }
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al iniciar sesión.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md w-full bg-gray-800 text-gray-100 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Nombre de usuario</label>
            <input
              name="username"
              type="text"
              placeholder="Ingresa tu nombre de usuario"
              value={form.username}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded-lg p-3 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Contraseña</label>
            <input
              name="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-700 bg-gray-900 text-gray-100 rounded-lg p-3 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors"
          >
            Entrar
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          ¿No tienes una cuenta?{' '}
          <a href="/register" className="text-purple-400 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
