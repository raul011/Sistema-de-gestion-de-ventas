import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // tu instancia de axios con token

const UserAdd = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Traer todos los roles al montar
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await api.get('/roles/ver/'); // endpoint que devuelve todos los roles
        setRoles(res.data);
      } catch (err) {
        console.error('Error al cargar roles:', err);
      }
    };
    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      console.log({ username, email, password, role_id: roleId });
      console.log('Role ID:', roleId, typeof roleId);
      await api.post('/users/add/', {
        username,
        email,
        password,
        role_id: Number(roleId),
      });
      navigate('/dashboard/users/ver'); // volver a la lista
    } catch (err) {
      console.error('Error al crear usuario:', err);
      setError('No se pudo crear el usuario. Revisa los datos.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Agregar Usuario</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 px-2 py-1 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 px-2 py-1 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 px-2 py-1 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Rol</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="w-full border border-gray-300 px-2 py-1 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Selecciona un rol</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Usuario'}
        </button>
      </form>
    </div>
  );

};

export default UserAdd;
