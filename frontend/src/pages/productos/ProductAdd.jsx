import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const ProductAdd = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  // Traer categorías disponibles
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories/');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('precio_compra', 0);
      formData.append('precio_venta', 0);
      formData.append('stock', 0);
      formData.append('category_id', category);
      if (image) formData.append('image', image);

      await api.post('/products/add/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/dashboard/products');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Agregar Producto</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-lg shadow-lg"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          required
        />

        <textarea
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
          required
        >
          <option value="">Seleccione una categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full p-2 border border-gray-300 rounded bg-gray-50 cursor-pointer hover:bg-gray-100 text-gray-800"
        />

        <button
          type="submit"
          className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold transition-colors"
        >
          Crear Producto
        </button>
      </form>
    </div>
  );


};

export default ProductAdd;
