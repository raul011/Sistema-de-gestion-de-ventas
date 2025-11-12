// components/pago/CardForm.jsx
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CardForm = ({ orderId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      '{{clientSecret}}', // ← aquí debes pasar `clientSecret` como prop
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (error) {
      toast.error(error.message);
      setProcessing(false);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      toast.success('¡Pago exitoso!');
      onSuccess(); // ← Llama esta función para limpiar carrito y redirigir
    } else {
      toast.error('Pago no completado');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="bg-white p-4 rounded" />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded"
      >
        {processing ? 'Procesando...' : 'Pagar ahora'}
      </button>
    </form>
  );
};

export default CardForm;
