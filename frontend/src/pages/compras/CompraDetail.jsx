import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useParams } from 'react-router-dom';

const CompraDetail = () => {
  const { id } = useParams();
  const [compra, setCompra] = useState(null);

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const res = await api.get(`/compras/${id}/`);
        console.log(res?.data);
        setCompra(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompra();
  }, [id]);

  if (!compra) return <p className="text-center mt-10 text-gray-500">Cargando compra...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-write-600 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        Detalle de Compra #{compra.id}
      </h1>

      <div className="mb-6 grid grid-cols-2 gap-4 text-gray-700">
        <div>
          <span className="font-semibold">Proveedor:</span> {compra.proveedor_nombre}
        </div>
        <div>
          <span className="font-semibold">Fecha:</span> {new Date(compra.fecha).toLocaleString()}
        </div>
        <div>
          <span className="font-semibold">Total:</span> ${compra.total}
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2 text-green-700">Productos:</h2>
      <table className="w-full border-collapse border border-gray-300 text-gray-800">
        <thead>
          <tr className="bg-blue-200 text-gray-900">
            <th className="border px-4 py-2 text-left">Producto</th>
            <th className="border px-4 py-2 text-left">Descripcion</th>
            <th className="border px-4 py-2 text-center">Cantidad</th>
            <th className="border px-4 py-2 text-right">Precio Unitario</th>
            <th className="border px-4 py-2 text-right">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {compra.detalles.map((detalle) => (
            <tr key={detalle.id} className="bg-blue-50 hover:bg-blue-100">
              <td className="border px-4 py-2 font-medium">{detalle.producto.name}</td>
              <td className="border px-4 py-2 font-medium">{detalle.producto.description}</td>
              <td className="border px-4 py-2 text-center">{detalle.cantidad}</td>
              <td className="border px-4 py-2 text-right">${detalle.precio_unitario}</td>
              <td className="border px-4 py-2 text-right font-semibold">${detalle.subtotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompraDetail;
