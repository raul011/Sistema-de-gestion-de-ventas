import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const PermissionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del permiso
  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const res = await api.get(`/roles/permissions/${id}/`);
        setName(res.data.name || '');
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el permiso.');
      }
    };

    fetchPermission();
  }, [id]);

  // Guardar cambios
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.put(`/roles/permissions/${id}/edit/`, { name });
      navigate('/dashboard/permissions/ver');
    } catch (err) {
      console.error(err);
      setError('Error al actualizar el permiso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-100 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
        Editar Permiso
      </h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-800">
            Nombre del permiso
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Ingresa el nombre del permiso"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-70"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
};

export default PermissionEdit;
