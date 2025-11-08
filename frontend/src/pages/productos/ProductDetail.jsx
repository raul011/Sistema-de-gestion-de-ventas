import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}/`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error al obtener el producto:', err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="text-center mt-10">Cargando producto...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-3xl w-full">
        {/* Imagen principal */}
        <div className="mb-4">
          <img
            src={product.image || '/no-image.png'}
            alt={product.name}
            className="w-full h-72 object-cover rounded-lg"
          />
        </div>

        {/* Galería de imágenes adicionales */}
        {product.images && product.images.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {product.images.map((img) => (
              <img
                key={img.id}
                src={img.image}
                alt={`Imagen ${product.name}`}
                className="w-24 h-24 object-cover rounded-md border hover:scale-105 transition-transform"
              />
            ))}
          </div>
        )}

        {/* Información del producto */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-3">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <p className="text-green-600 font-bold text-2xl">${product.price}</p>
          <p className="text-gray-500">Stock disponible: {product.stock}</p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4">
          {/* 🛒 Botón para comprar */}
          <Link
            to={`/dashboard/compras/add/${product.id}`}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Comprar ahora
          </Link>

          {/* 💰 Botón para vender */}
          <Link
            to={`/dashboard/ventas/add/${product.id}`}
            className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Vender producto
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
