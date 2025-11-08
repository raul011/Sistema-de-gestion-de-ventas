import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const VentasView = () => {
  const [ventas, setVentas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const res = await api.get('/ventas/'); // tu endpoint de ventas
        setVentas(res.data.results); // results si tu API tiene paginación
      } catch (err) {
        console.error(err);
      }
    };
    fetchVentas();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Lista de Ventas</h1>
      <table className="min-w-full border border-gray-300 rounded-lg shadow">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border px-4 py-2 text-left">ID</th>
            <th className="border px-4 py-2 text-left">Cliente</th>
            <th className="border px-4 py-2 text-left">Fecha</th>
            <th className="border px-4 py-2 text-right">Total</th>
            <th className="border px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id} className="hover:bg-gray-100 transition-colors duration-150">
              <td className="border px-4 py-2">{venta.id}</td>
              <td className="border px-4 py-2">{venta.cliente_nombre}</td>
              <td className="border px-4 py-2">{new Date(venta.fecha).toLocaleString()}</td>
              <td className="border px-4 py-2 text-right">${venta.total}</td>
              <td className="border px-4 py-2 text-center">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  onClick={() => navigate(`/dashboard/ventas/detalle/${venta.id}`)}
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VentasView;
