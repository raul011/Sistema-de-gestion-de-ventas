import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

const ProductEdit = () => {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/productos/${id}/`);
        setNombre(res.data.nombre);
        setDescripcion(res.data.descripcion);
        setPrecio(res.data.precio);
        setStock(res.data.stock);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/productos/edit/${id}/`, { nombre, descripcion, precio, stock });
      navigate('/dashboard/products');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Editar Producto</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} />
        <input type="number" value={precio} onChange={e => setPrecio(e.target.value)} />
        <input type="number" value={stock} onChange={e => setStock(e.target.value)} />
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default ProductEdit;
