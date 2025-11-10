import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const ProveedoresView = () => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const res = await api.get('/proveedores/ver/');
        console.log('Datos del backend:', res.data);
        setProveedores(res.data);
      } catch (err) {
        console.error('Error al cargar proveedores:', err);
        setError('No se pudo cargar la lista de proveedores.');
      } finally {
        setLoading(false);
      }
    };
    fetchProveedores();
  }, []);

  // 🔍 Filtrar proveedores según el término de búsqueda
  const filteredProveedores = proveedores.filter((prov) =>
    prov.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Proveedores</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* 🔎 Campo de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 p-2 border border-gray-400 rounded 
               text-gray-900 placeholder-gray-500 
               bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-gray-800">Cargando proveedores...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200 text-gray-900">
            <tr>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Correo</th>
              <th className="p-2 border">Teléfono</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {filteredProveedores.length > 0 ? (
              filteredProveedores.map((prov) => (
                <tr key={prov.id} className="hover:bg-gray-100 transition-colors duration-150">
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
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4 text-gray-500">
                  No se encontraron proveedores.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProveedoresView;
