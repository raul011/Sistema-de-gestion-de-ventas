import { useEffect, useState } from 'react';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Search, ChevronDown, X } from 'lucide-react';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    search: '',
    sort: 'newest',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/store/products/?page=${currentPage}`);
        setProducts(res.data.results);
        setFilteredProducts(res.data.results);

        const total = Math.ceil(res.data.count / 10); // suponiendo 10 por página
        setTotalPages(total);

        const uniqueCategories = [
          ...new Map(res.data.results.map((item) => [item.category?.id, item.category])).values(),
        ].filter(Boolean);
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    let result = [...products];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.category) {
      result = result.filter((product) => product.category?.id === Number(filters.category));
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter((product) => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }

    setFilteredProducts(result);
  }, [filters, products]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      search: '',
      sort: 'newest',
    });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center bg-gray-900 text-gray-100 min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/4 mx-auto"></div>
          <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="h-56 bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-700 rounded"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-900 text-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 py-12 text-center rounded-lg mb-8">
        <h1 className="text-4xl font-bold text-white">Nuestros Productos</h1>
        <p className="text-gray-100 mt-2">
          Explora nuestra amplia selección de productos de alta calidad al mejor precio.
        </p>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="relative flex-grow max-w-md mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-gray-800 text-gray-100 placeholder-gray-400"
          />
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Filtro de categorías */}
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="pl-4 pr-10 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-gray-800 text-gray-100"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Filtro de rango de precios */}
          <div className="relative">
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="pl-4 pr-10 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none bg-gray-800 text-gray-100"
            >
              <option value="">Todos los precios</option>
              <option value="0-50">Hasta $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200">Más de $200</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Botón para limpiar filtros */}
          {(filters.category || filters.priceRange || filters.search) && (
            <button
              onClick={clearFilters}
              className="text-purple-400 hover:text-purple-500 flex items-center"
            >
              <X size={16} className="mr-1" />
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        ) : (
          <div className="text-center py-12 col-span-full">
            <h3 className="text-xl font-medium text-gray-300 mb-2">No se encontraron productos</h3>
            <p className="text-gray-400 mb-4">Intenta ajustar tus filtros de búsqueda</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-10 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-3 py-1 rounded ${page === currentPage ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;