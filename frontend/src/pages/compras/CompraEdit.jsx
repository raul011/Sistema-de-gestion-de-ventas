import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

const CompraEdit = () => {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState('');
  const [total, setTotal] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompra = async () => {
      try {
        const res = await api.get(`/compras/${id}/`);
        setProveedor(res.data.proveedor);
        setTotal(res.data.total);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCompra();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/compras/edit/${id}/`, { proveedor, total });
      navigate('/dashboard/compras/ver');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Editar Compra</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={proveedor}
          onChange={e => setProveedor(e.target.value)}
        />
        <input
          type="number"
          value={total}
          onChange={e => setTotal(e.target.value)}
        />
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
};

export default CompraEdit;
