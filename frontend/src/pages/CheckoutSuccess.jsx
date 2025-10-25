import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const CheckoutSuccess = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
        <CheckCircle size={64} className="mx-auto text-emerald-600 mb-4" />
        <h1 className="text-2xl font-bold mb-2">¡Gracias por tu compra!</h1>
        <p className="text-gray-600 mb-6">
          Tu pedido ha sido procesado exitosamente. Te enviaremos un correo con los detalles.
        </p>
        <Link
          to="/products"
          className="inline-block bg-emerald-600 text-white px-6 py-2 rounded hover:bg-emerald-700 transition-colors"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
