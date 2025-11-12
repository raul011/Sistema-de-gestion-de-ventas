import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import axios from '../../api/axios';
import { toast } from 'react-toastify';

const RelatedProducts = ({ productId }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (productId) fetchRelatedProducts();
  }, [productId]);

  const fetchRelatedProducts = async () => {
    try {
      const res = await axios.get(`store/products/${productId}/related/`);
      setRelated(
        res.data.map((prod) => ({
          ...prod,
          price: Number(prod.price) || 0,
          image: prod.image?.startsWith('http')
            ? prod.image
            : `http://3.143.156.86/${prod.image}`,
        }))
      );
    } catch (err) {
      console.error('Error al cargar productos relacionados:', err);
      toast.error('Error al cargar productos relacionados', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (related.length === 0) return <NoRelatedProducts />;

  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4">También te puede interesar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {related.map((prod) => (
          <ProductCard key={prod.id} product={prod} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="mt-12">
    <h2 className="text-xl font-semibold mb-4">También te puede interesar</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="border p-4 rounded-lg bg-white shadow-sm animate-pulse">
          <div className="w-full h-48 bg-gray-200 rounded"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="mt-4 flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const NoRelatedProducts = () => (
  <div className="mt-12 text-gray-500 text-center text-sm">
    No hay productos relacionados aún.
  </div>
);

const ProductCard = ({ product, addToCart }) => (
  <div className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
    <Link to={`/product/${product.id}`} className="block">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
        loading="lazy"
      />
      <h3 className="mt-2 font-medium text-gray-800 line-clamp-2">{product.name}</h3>
    </Link>
    <div className="flex justify-between items-center mt-2">
      <span className="bg-purple-600 text-white px-2 py-1 rounded font-semibold">
        ${product.price.toFixed(2)}
      </span>
      <button
        className="p-2 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
        aria-label="Añadir al carrito"
      >
        <ShoppingCart size={18} />
      </button>
    </div>
  </div>
);

export default RelatedProducts;