import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const EditRoleView = () => {
  const { id } = useParams(); // id del rol
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Traer todos los permisos
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await api.get('/roles/permissions/ver/');
        setAllPermissions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPermissions();
  }, []);

  // Traer datos del rol actual
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await api.get(`/roles/${id}/`); // endpoint para traer un rol específico
        setName(res.data.name);
        setPermissions(res.data.permissions.map(p => p.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [id]);

  const handleCheckboxChange = (permId) => {
    setPermissions(prev =>
      prev.includes(permId)
        ? prev.filter(id => id !== permId)
        : [...prev, permId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/roles/${id}/edit/`, {
        name,
        permissions,
      });
      navigate('/dashboard/roles/ver'); // volver a la lista
    } catch (err) {
      console.error('Error al actualizar rol:', err);
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Rol</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Nombre del rol</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Permisos</label>
          <div className="flex flex-col space-y-1">
            {allPermissions.map(p => (
              <label key={p.id}>
                <input
                  type="checkbox"
                  checked={permissions.includes(p.id)}
                  onChange={() => handleCheckboxChange(p.id)}
                  className="mr-2"
                />
                {p.name}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default EditRoleView;
