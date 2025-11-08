import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const PermissionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [codename, setCodename] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos del permiso
  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const res = await api.get(`/roles/permissions/${id}/`);
        setName(res.data.name);
        setCodename(res.data.codename);
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
      await api.put(`/roles/permissions/${id}/edit/`, { name, codename });
      navigate('/dashboard/permissions/ver');
    } catch (err) {
      console.error(err);
      setError('Error al actualizar el permiso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <label className="block mb-2">Nombre</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <label className="block mb-2">Código</label>
      <input
        value={codename}
        onChange={(e) => setCodename(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />

      <button
        type="submit"
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </form>
  );
};

export default PermissionEdit;
