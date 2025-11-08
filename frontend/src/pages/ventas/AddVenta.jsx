import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const AddVenta = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '' });
    const [detalles, setDetalles] = useState([{ producto: '', cantidad: 1, precio_unitario: 0 }]);
    const [error, setError] = useState('');
    // Traer productos y usuarios del backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resProducts = await api.get('/products/');
                setProducts(resProducts.data.results || []); // Por si results no existe
                const resUsers = await api.get('/users/');
                setUsuarios(resUsers.data || []); // <-- importante
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleDetalleChange = (index, field, value) => {
        const newDetalles = [...detalles];
        newDetalles[index][field] = value;
        setDetalles(newDetalles);
    };

    const addDetalle = () => setDetalles([...detalles, { producto: '', cantidad: 1, precio_unitario: 0 }]);
    const removeDetalle = (index) => setDetalles(detalles.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        let userId = selectedUser;

        try {
            // Si es un nuevo usuario, crearlo primero
            if (isNewUser) {
                const resNewUser = await api.post('/users/', newUser);
                userId = resNewUser.data.id;
            }

            // Crear la venta
            await api.post('/ventas/', { user: userId, detalles });
            navigate('/dashboard/ventas/ver');
        } catch (err) {
            console.error(err);
            setError('Ocurrió un error al crear la venta');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Agregar Venta</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
                
                {/* Usuario */}
                <div>
                    <label className="block mb-1 text-gray-800 font-medium">Cliente</label>
                    {!isNewUser ? (
                        <div className="flex gap-2 items-center">
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="w-full border px-3 py-2 rounded text-gray-900 bg-white"
                                required
                            >
                                <option value="">Selecciona un cliente</option>
                                {usuarios.map((u) => (
                                    <option key={u.id} value={u.id}>{u.username}</option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => setIsNewUser(true)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                            >
                                Nuevo cliente
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                className="w-full border px-3 py-2 rounded text-gray-900"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Correo"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                className="w-full border px-3 py-2 rounded text-gray-900"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setIsNewUser(false)}
                                className="text-blue-600 underline"
                            >
                                Cancelar nuevo cliente
                            </button>
                        </div>
                    )}
                </div>

                {/* Detalles de venta */}
                <div className="space-y-2">
                    <label className="block text-gray-800 font-medium">Detalles de la venta</label>
                    {detalles.map((detalle, index) => (
                        <div key={index} className="flex gap-2 items-center">
                            <select
                                value={detalle.producto}
                                onChange={(e) => handleDetalleChange(index, 'producto', e.target.value)}
                                className="border px-2 py-1 rounded flex-1 text-gray-900 bg-white"
                                required
                            >
                                <option value="">Selecciona un producto</option>
                                {products.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <div className="flex gap-2 items-center">
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-sm mb-1">Cantidad</label>
                                    <input
                                        type="number"
                                        value={detalle.cantidad}
                                        onChange={(e) => handleDetalleChange(index, 'cantidad', e.target.value)}
                                        className="border px-2 py-1 w-20 rounded text-gray-900"
                                        placeholder="Cantidad"
                                        min={1}
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-gray-700 text-sm mb-1">Precio</label>
                                    <input
                                        type="number"
                                        value={detalle.precio_unitario}
                                        onChange={(e) => handleDetalleChange(index, 'precio_unitario', e.target.value)}
                                        className="border px-2 py-1 w-24 rounded text-gray-900"
                                        placeholder="Precio"
                                        min={0}
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeDetalle(index)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded mt-6"
                                >
                                    X
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addDetalle}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mt-2"
                    >
                        Agregar producto
                    </button>
                </div>

                {error && <p className="text-red-600 font-medium">{error}</p>}

                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Crear Venta
                </button>
            </form>
        </div>
    );
};

export default AddVenta;
