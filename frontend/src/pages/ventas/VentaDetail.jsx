import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

const VentaDetail = () => {
  const { id } = useParams();
  const [venta, setVenta] = useState(null);

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const res = await api.get(`/ventas/${id}/`);
        console.log('Detalle de venta:', res.data);
        setVenta(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVenta();
  }, [id]);

  if (!venta) return <p className="p-6 text-gray-700">Cargando detalles de la venta...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Detalle de Venta #{venta.id}</h1>
      <p className="mb-2 text-gray-700"><strong>Cliente:</strong> {venta.cliente_nombre}</p>
      <p className="mb-4 text-gray-700"><strong>Fecha:</strong> {new Date(venta.fecha).toLocaleString()}</p>

      <table className="min-w-full border border-gray-300 rounded-lg shadow">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="border px-4 py-2 text-left">Producto</th>
            <th className="border px-4 py-2 text-center">Cantidad</th>
            <th className="border px-4 py-2 text-right">Precio Unitario</th>
            <th className="border px-4 py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody className="text-gray-800"> {/* Hace el texto oscuro */}
          {venta.detalles.map((detalle) => (
            <tr
              key={detalle.id}
              className="hover:bg-gray-100 transition-colors duration-150"
            >
              <td className="border px-4 py-2">{detalle.producto.name}</td>
              <td className="border px-4 py-2 text-center">{detalle.cantidad}</td>
              <td className="border px-4 py-2 text-right">${detalle.precio_unitario}</td>
              <td className="border px-4 py-2 text-right">${detalle.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <p className="text-lg font-semibold text-gray-800">Total: ${venta.total}</p>
      </div>
    </div>
  );
};

export default VentaDetail;
