import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 py-24 px-4">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between">
        {/* Texto principal */}
        <div className="text-left md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Descubre productos excepcionales
          </h1>
          <p className="mt-4 text-lg text-pink-100 mb-8">
            Explora nuestra colección de artículos de alta calidad seleccionados para ti.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg transform hover:scale-105 transition-all"
            >
              <ShoppingBag size={20} />
              Comprar ahora
            </Link>
            <Link
              to="/categories"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium border border-gray-600 shadow-md transform hover:scale-105 transition-all"
            >
              Explorar categorías
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>

        {/* Imagen destacada */}
        <div className="md:w-1/2 flex justify-center">
          <div className="bg-gray-900 p-4 rounded-lg shadow-xl transform rotate-2 hover:rotate-0 transition-transform max-w-sm">
            <div className="bg-gray-800 rounded p-8 flex items-center justify-center">
              <ShoppingBag size={120} className="text-purple-400" />
            </div>
            <div className="mt-4 text-center">
              <span className="inline-block bg-gray-700 text-purple-300 px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                Nueva colección
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;