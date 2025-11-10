import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CategoriesPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories/');
        setCategories(res.data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };

    fetchCategories();
  }, []);

  const rol = user?.role;

  // 🔎 Filtrar categorías por nombre
  const categoriasFiltradas = categories.filter((cat) =>
    cat.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Categorías
      </h1>

      {/* 🔍 Buscador */}
      <div className="mb-6 flex items-center justify-center">
        <input
          type="text"
          placeholder="Buscar categoría por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-4 py-2 w-full sm:w-1/2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-800 placeholder-gray-500 shadow-sm"
        />
      </div>

      {/* Solo Admin o Empleado pueden agregar categorías */}
      {isAuthenticated && (rol === 'Admin' || rol === 'Empleado') && (
        <div className="flex justify-center mb-6">
          <Link
            to="/dashboard/categories/add"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Agregar Categoría
          </Link>
        </div>
      )}

      {/* 🧩 Grid de categorías */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoriasFiltradas.length > 0 ? (
          categoriasFiltradas.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Imagen de la categoría */}
              <Link
                to={
                  isAuthenticated && (rol === 'Admin' || rol === 'Empleado')
                    ? '#'
                    : `/products/category/${cat.id}`
                }
              >
                <img
                  src={cat.image || '/no-image.png'}
                  alt={cat.name}
                  className="w-full h-48 object-cover"
                />
              </Link>

              <div className="p-4 flex flex-col justify-between h-32">
                <h2 className="text-lg font-semibold text-gray-800 truncate mb-2">
                  {cat.name}
                </h2>

                {isAuthenticated && (rol === 'Admin' || rol === 'Empleado') ? (
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/dashboard/categories/edit/${cat.id}`}
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                    >
                      Editar
                    </Link>
                    <Link
                      to={`/products/category/${cat.id}`}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Ver productos
                    </Link>
                  </div>
                ) : (
                  <Link
                    to={`/products/category/${cat.id}`}
                    className="mt-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center block"
                  >
                    Ver productos
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No se encontraron categorías con ese nombre.
          </p>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
