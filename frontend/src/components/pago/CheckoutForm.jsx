import { CreditCard, Truck, ShieldCheck } from 'lucide-react';

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const CheckoutForm = ({ formData, handleChange, clientSecret, loading, onPaymentSuccess, }) => {
  //  PUNTO 3: Hooks y función para confirmar el pago

  useEffect(() => {
    console.log('Client Secret en CheckoutForm:', clientSecret);
  }, [clientSecret]);

  const stripe = useStripe();
  const elements = useElements();


  const handleStripeSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      toast.error("No se detectó el campo de tarjeta. Intenta recargar.");
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: formData.fullName,
          email: formData.email,
        },
      },
    });

    if (result.error) {
      toast.error(result.error.message);
    } else if (result.paymentIntent.status === 'succeeded') {
      toast.success('✅ Pago exitoso');
      onPaymentSuccess();
    }
  };

  return (
    <div className="lg:w-2/3">
      {/* Información de envío */}
      <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-100">
          <Truck size={20} className="mr-2 text-emerald-500" />
          Información de envío
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Nombre completo</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-900 text-gray-100 border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-900 text-gray-100 border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-900 text-gray-100 border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Ciudad</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-900 text-gray-100 border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Código postal</label>
            <input
              type="text"
              name="postal"
              value={formData.postal}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-900 text-gray-100 border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-900 text-gray-100 border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-colors"
              required
            />
          </div>
        </div>
      </div>







      <form onSubmit={handleStripeSubmit} className="space-y-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">Datos de tarjeta</label>
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
          <CardElement
            options={{
              style: {
                base: {
                  color: "#fff",
                  fontSize: "16px",
                  '::placeholder': {
                    color: "#9ca3af",
                  },
                },
                invalid: {
                  color: "#f87171",
                },
              },
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!stripe || !clientSecret || loading}
          className="bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 transition"
        >
          Confirmar pago
        </button>
      </form>

      {/* Resumen del pedido */}
      <div className="bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center text-gray-100 bg-gray-700 p-3 rounded">
          <CreditCard size={20} className="mr-2 text-emerald-500" />
          Resumen del pedido
        </h2>
        {/* Contenido del resumen */}
      </div>
    </div>
  );
};

export default CheckoutForm;