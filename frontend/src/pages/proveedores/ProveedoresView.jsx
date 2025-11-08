import React, { useEffect, useState } from 'react';
import api from '../../api/axios'; // tu instancia de axios
import { useNavigate } from 'react-router-dom';

const ProveedoresView = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await api.get('/proveedores/ver/'); // endpoint Django
         console.log('Datos del backend:', res.data); // 👈 revisa qué trae
        setProveedores(res.data.results); // 👈 aquí usamos results
      } catch (err) {
        console.error('Error al cargar proveedores:', err);
        setError('No se pudo cargar la lista de proveedores.');
      } finally {
        setLoading(false);
      }
    };
    fetchProveedores();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Proveedores</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Cargando proveedores...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-black-200">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Correo</th>
              <th className="p-2 border">Teléfono</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((prov) => (
              <tr key={prov.id} className="hover:bg-gray-600">
                <td className="p-2 border">{prov.nombre}</td>
                <td className="p-2 border">{prov.correo}</td>
                <td className="p-2 border">{prov.telefono}</td>
                <td className="p-2 border text-center space-x-2">
                  <button
                    onClick={() => navigate(`/dashboard/proveedores/edit/${prov.id}`)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => console.log('Eliminar', prov.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProveedoresView;
