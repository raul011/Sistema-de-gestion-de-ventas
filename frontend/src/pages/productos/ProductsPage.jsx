import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useCart } from "../../context/CartContext"; // usamos el contexto del carrito

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const { addToCart, cartItems } = useCart(); // usamos addToCart y cartItems desde el contexto

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products/");
        setProducts(res.data.results || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // Total de productos en el carrito
  const totalItems = cartItems.reduce((total, item) => total + item.cantidad, 0);

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Nuestros Productos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
          >
            <Link to={`/dashboard/product/${p.id}`}>
              <img
                src={p.image || "/no-image.png"}
                alt={p.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{p.name}</h2>
                <p className="text-green-600 font-bold text-lg">${p.price}</p>
                <p className="text-sm text-gray-500">Stock: {p.stock}</p>
              </div>
            </Link>
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

      {/* Carrito fijo abajo si hay productos */}
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
  );
};

export default ProductsPage;
