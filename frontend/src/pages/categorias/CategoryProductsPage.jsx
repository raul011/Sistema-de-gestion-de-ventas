import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth  } from '../../context/AuthContext'; // contexto del usuario
import DashboardSidebar from '../../components/DashboardSidebar'; // tu sidebar

const CategoryProductsPage = () => {
  const { id } = useParams(); 
  const [products, setProducts] = useState([]);
  const { addToCart, cartItems } = useCart();

  const { user } = useAuth(); // asumimos que user tiene {role: "admin"|"empleado"|...}
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get(`/products/?category=${id}`);
        setProducts(res.data.results || []);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      }
    };

    fetchProducts();
  }, [id]);

  const totalItems = cartItems.reduce((total, item) => total + item.cantidad, 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mostrar sidebar solo si usuario es empleado o admin */}
      {(user?.role === 'Admin' || user?.role === 'Empleado' || user?.role === 'Encargado' || user?.role === 'Asistente') && <DashboardSidebar />}

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Productos de la categoría</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
            >
              <img
                src={p.image || '/no-image.png'}
                alt={p.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex-1">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{p.name}</h2>
                <p className="text-green-600 font-bold text-lg">${p.price}</p>
                <p className="text-sm text-gray-500">Stock: {p.stock}</p>
              </div>
              <div className="p-4 border-t border-gray-200 mt-auto">
                <button
                  onClick={() => addToCart(p)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No hay productos en esta categoría.
          </div>
        )}

        {totalItems > 0 && (
          <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-64">
            <h2 className="font-bold text-lg mb-2">Carrito ({totalItems})</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between mb-1">
                <span>{item.name} x {item.cantidad}</span>
                <span>${(item.price * item.cantidad).toFixed(2)}</span>
              </div>
            ))}
            <div className="text-right font-bold mt-2">
              Total: ${cartItems.reduce((acc, item) => acc + item.price * item.cantidad, 0).toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
