import React, { useEffect, useState } from 'react';
import api from '../../api/axios'; // tu instancia de Axios
import { useNavigate } from 'react-router-dom';

const UsersView = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    // Traer usuarios desde el backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get('/users/'); // endpoint que devuelve todos los usuarios
                setUsers(res.data);
            } catch (err) {
                console.error('Error al obtener usuarios:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    if (loading) return <p>Cargando usuarios...</p>;

    return (
        <div className="p-6 bg-black-600 rounded">
            <h1 className="text-2xl font-black mb-4">Usuarios</h1>
            <table className="w-full border border-gray-400 bg-gray-800 text-gray-100 rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="p-2  bg-black border">Nombre de usuario</th>
                        <th className="p-2  bg-black border">Email</th>
                        <th className="p-2  bg-black border">Rol</th>
                        <th className="p-2  bg-black border">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id} className="hover:bg-gray-600">
                            <td className="p-2   border">{user.username}</td>
                            <td className="p-2  border">{user.email}</td>
                            <td className="p-2  border">{user.role || 'Sin rol'}</td>
                            <td className="p-2 border text-center space-x-2">
                                {/* Botones de acción */}
                                <button
                                    onClick={() => navigate(`/dashboard/users/edit/${user.id}`)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                                >
                                    Editar
                                </button>
                                <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UsersView;
