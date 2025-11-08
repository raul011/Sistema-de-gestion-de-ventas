import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const ProveedorAdd = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log({ nombre, correo, telefono }); // 👈 para debug
      await api.post('/proveedores/add/', {
        nombre,
        correo,
        telefono,
      });
      navigate('/dashboard/proveedores/ver'); // volver a la lista
    } catch (err) {
      console.error('Error al crear proveedor:', err);
      setError('No se pudo crear el proveedor. Revisa los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-black rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Agregar Proveedor</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Teléfono</label>
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-semibold"
        >
          {loading ? 'Creando...' : 'Crear'}
        </button>
        
      </form>
    </div>
  );
};

export default ProveedorAdd;
