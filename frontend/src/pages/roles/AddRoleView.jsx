import React, { useState } from 'react';
import api from '../../api/axios'; // Ajusta la ruta según tu proyecto
import { useNavigate } from 'react-router-dom';

const AddRoleView = () => {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState([]); // ids de permisos seleccionados
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Traer todos los permisos disponibles al montar
  React.useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await api.get('/roles/permissions/'); // endpoint que devuelve todos los permisos
        setAllPermissions(res.data);
      } catch (err) {
        console.error('Error al cargar permisos:', err);
      }
    };
    fetchPermissions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/roles/add/', {
        name,
        permissions,
      });
      navigate('/dashboard/roles/ver'); // volver a la lista de roles
    } catch (err) {
      console.error('Error al crear rol:', err);
      setError('No se pudo crear el rol. Revisa los datos.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (permId) => {
    setPermissions((prev) =>
      prev.includes(permId)
        ? prev.filter((id) => id !== permId)
        : [...prev, permId]
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Agregar Rol</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg text-gray-100">
        <div className="mb-4">
          <label className="block mb-2 font-semibold">Nombre del rol</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded text-black-900"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Permisos</label>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {allPermissions.map((perm) => (
              <label key={perm.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={perm.id}
                  checked={permissions.includes(perm.id)}
                  onChange={() => handleCheckboxChange(perm.id)}
                  className="accent-blue-500"
                />
                <span>{perm.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-semibold"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Rol'}
        </button>
      </form>
    </div>
  );
};

export default AddRoleView;
