import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} añadido al carrito`);
  };

  return (
    <div
      className="bg-gray-800 text-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-700 transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen y acciones */}
      <div className="relative h-56 w-full overflow-hidden">
        <Link to={`/product/${product.id}`} className="block h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
          />

          {product.discountPercentage > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded shadow">
              -{product.discountPercentage}%
            </span>
          )}
        </Link>

        {/* Botones rápidos */}
        <div
          className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <button
            className="bg-gray-700 p-2 rounded-full shadow hover:bg-gray-600 transition-colors"
            title="Añadir a favoritos"
          >
            <Heart size={18} className="text-gray-100" />
          </button>

          <Link
            to={`/product/${product.id}`}
            className="bg-gray-700 p-2 rounded-full shadow hover:bg-gray-600 transition-colors"
            title="Ver detalles"
          >
            <Eye size={18} className="text-gray-100" />
          </Link>
        </div>
      </div>

      {/* Info del producto */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h2 className="text-base font-semibold text-gray-100 hover:text-purple-400 transition-colors line-clamp-2">
            {product.name}
          </h2>
        </Link>

        {product.category?.name && (
          <p className="text-xs text-gray-400 mt-1">{product.category.name}</p>
        )}

        <div className="flex items-center justify-between mt-4">
          {/* Precio */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-purple-400">${product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm line-through text-gray-500">${product.originalPrice}</span>
            )}
          </div>

          {/* Botón carrito */}
          <button
            onClick={handleAddToCart}
            disabled={!product.stock}
            className={`p-2 rounded-full transition-colors ${product.stock
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>

        {!product.stock && (
          <p className="mt-2 text-xs text-red-500 font-medium">Agotado</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
