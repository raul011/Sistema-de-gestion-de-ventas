import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { Package, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/store/categories/');
      setCategories(response.data.results ?? response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err) => {
    setError(err.message);
    toast.error('Error al cargar las categorías', {
      position: 'top-center',
      autoClose: 3000,
    });
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl bg-gray-900 text-gray-100 min-h-screen">
      {/* Encabezado */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 py-12 text-center rounded-lg mb-8">
        <h1 className="text-4xl font-bold text-white">Nuestras Categorías</h1>
        <p className="text-gray-100 mt-2">
          Explora nuestras categorías y encuentra lo que necesitas.
        </p>
      </div>

      {/* Cuadrícula de categorías */}
      {categories.length === 0 ? <NoCategories /> : <CategoriesGrid categories={categories} />}
    </div>
  );
};

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100">
    <Loader2 className="animate-spin h-12 w-12 text-purple-600" />
  </div>
);

const ErrorMessage = ({ error }) => (
  <div className="container mx-auto px-4 py-8 text-center bg-gray-900 text-gray-100">
    <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-md mx-auto shadow-md">
      <p className="font-semibold">Error al cargar las categorías:</p>
      <p>{error}</p>
    </div>
  </div>
);

const NoCategories = () => (
  <div className="text-center py-12 bg-gray-900 text-gray-100">
    <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
    <p className="text-gray-400 text-lg">No se encontraron categorías</p>
  </div>
);

const CategoriesGrid = ({ categories }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {categories.map((category) => (
      <CategoryCard key={category.id} category={category} />
    ))}
  </div>
);

const CategoryCard = ({ category }) => (
  <Link
    to={`/category/${category.id}`}
    className="group bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
  >
    <div className="relative h-48 bg-gray-700">
      {category.image ? (
        <img
          src={category.image.startsWith('http')
            ? category.image
            : `http://3.143.156.86/${category.image}`}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Package className="text-gray-400 h-16 w-16" />
        </div>
      )}
    </div>
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-100 mb-2 group-hover:text-purple-400 transition-colors">
        {category.name}
      </h2>
      {category.description && (
        <p className="text-gray-400 line-clamp-3">
          {category.description}
        </p>
      )}
    </div>
  </Link>
);

export default CategoriesPage;