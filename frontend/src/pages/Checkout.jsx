import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import CheckoutForm from '../components/pago/CheckoutForm';
import Order from '../components/pago/Order';



import { useEffect } from 'react';



const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [clientSecret, setClientSecret] = useState('');


  const [formData, setFormData] = useState({
    fullName: user?.username || '',
    email: user?.email || '',
    address: user?.address || '',
    city: '',
    postal: '',
    phone: user?.phone || '',
    paymentMethod: 'card',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = parseFloat((subtotal + shipping).toFixed(2));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para confirmar el pedido');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const orderRes = await axios.post('/orders/create/', {
        shipping_address: `${formData.fullName}, ${formData.address}, ${formData.city}, ${formData.postal}, Tel: ${formData.phone}`,
        total_price: total,
        items: cartItems.map(item => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      const orderId = orderRes.data.id;


      if (!orderId) {
        throw new Error('No se pudo obtener la ID de la orden.');
      }

      const transactionId = `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      await axios.post('/payments/create/', {
        order_id: orderId,
        method: formData.paymentMethod,
        amount: total,
        transaction_id: transactionId,
      });

      clearCart();
      toast.success('¡Pedido y pago completados con éxito!');
      navigate('/checkout-success');
    } catch (err) {
      console.error('Error en checkout:', err.response?.data || err);
      const errors = err.response?.data;

      if (errors?.order) {
        toast.error(`Error con la orden: ${errors.order[0]}`);
      } else if (errors?.amount) {
        toast.error(`Monto inválido: ${errors.amount[0]}`);
      } else if (errors?.transaction_id) {
        toast.error(`Error con ID de transacción: ${errors.transaction_id[0]}`);
      } else {
        toast.error('Error al procesar el pedido. Revisa los datos e inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log('Ejecutando fetchClientSecret con total:', total);
    const fetchClientSecret = async () => {
      try {
        const res = await axios.post('/payments/intent/', {
          amount: total
        });

        setClientSecret(res.data.clientSecret); // Asegúrate que el backend devuelve 'client_secret'
        //console.log('Client Secret en checkout:',res.data.clientSecret);

      } catch (err) {
        console.error('Error al obtener clientSecret:', err);
        toast.error('No se pudo preparar el pago.');
      }
    };
    fetchClientSecret();
  }, [total]);
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-gray-900 text-gray-100 min-h-screen">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/cart')}
          className="text-gray-400 hover:text-emerald-400 mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold">Finalizar compra</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <CheckoutForm
          formData={formData}
          handleChange={handleChange}
          loading={loading}
          clientSecret={clientSecret} // 👈 AÑADE ESTA LÍNEA

        />

        <Order
          cartItems={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          loading={loading}
          handleSubmit={handleSubmit}
        />

      </div>
    </div>
  );
};

export default Checkout;
