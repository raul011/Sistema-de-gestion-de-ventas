import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const VentasView = () => {
  const [ventas, setVentas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await api.get('/ventas/'); // tu endpoint de ventas
        console.log(res.data.results);
        setVentas(res.data.results || res.data); // usa .results si tu API está paginada
      } catch (err) {
        console.error(err);
      }
    };
    fetchVentas();
  }, []);

  // 🔍 Filtrar ventas según el nombre del cliente
  const filteredVentas = ventas.filter((venta) =>
    venta.cliente_username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Lista de Ventas</h1>

      {/* 🔎 Campo de búsqueda */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 p-2 border border-gray-400 rounded 
                     text-gray-900 placeholder-gray-500 
                     bg-white focus:outline-none focus:ring-2 
                     focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <table className="min-w-full border border-gray-300 rounded-lg shadow">
        <thead className="bg-gray-200 text-gray-900">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Cliente</th>
            <th className="border px-4 py-2 text-left">Fecha</th>
            <th className="border px-4 py-2 text-right">Total</th>
            <th className="border px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {filteredVentas.length > 0 ? (
            filteredVentas.map((venta) => (
              <tr
                key={venta.id}
                className="hover:bg-gray-100 transition-colors duration-150"
              >
                <td className="border px-4 py-2">{venta.id}</td>
                <td className="border px-4 py-2">{venta.cliente_username}</td>
                <td className="border px-4 py-2">
                  {new Date(venta.fecha).toLocaleString()}
                </td>
                <td className="border px-4 py-2 text-right">${venta.total}</td>
                <td className="border px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    onClick={() =>
                      navigate(`/dashboard/ventas/detalle/${venta.id}`)
                    }
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-gray-500 py-4">
                No se encontraron ventas para "{searchTerm}".
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VentasView;
