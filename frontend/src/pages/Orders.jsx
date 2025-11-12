/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('/orders/');
        setOrders(res.data.results ?? res.data);
      } catch (err) {
        console.error('Error al cargar pedidos:', err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Mis pedidos</h1>

      {orders.length === 0 ? (
        <p className="text-gray-400">No tienes pedidos aún.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-6 bg-gray-800 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-100">Pedido #{order.id}</h2>
                  <p className="text-sm text-gray-400">Fecha: {new Date(order.created_at).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-400">Envío: {order.shipping_address}</p>
                  <p className="text-sm text-gray-400">Método de pago: {order.payment?.method || '---'}</p>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold text-lg">
                    ${parseFloat(order.total_price).toFixed(2)}
                  </span>
                  <div className="text-sm text-gray-400">
                    {order.is_paid ? 'Pagado' : 'Pendiente'}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-3 space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-300">
                    <span>{item.quantity} x {item.product.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
