import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const UserEdit = () => {
    const { id } = useParams(); // obtener id del usuario desde la URL
    const navigate = useNavigate();
    const [error, setError] = useState('');     // para mostrar errores
    const [loading, setLoading] = useState(false); // para mostrar estado de carga
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('');
    const [roles, setRoles] = useState([]);

    // cargar datos del usuario y roles
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/users/${id}/`);
                setUsername(res.data.username);
                setEmail(res.data.email);
                setRoleId(res.data.role_id);
                console.log(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchRoles = async () => {
            try {
                const res = await api.get('/roles/ver/');
                setRoles(res.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
        fetchRoles();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/users/${id}/edit/`, { username, email, role_id: Number(roleId) });
            navigate('/dashboard/users/ver'); // volver a la lista
        } catch (err) {
            console.error('Error al editar usuario:', err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-black-100 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Editar Usuario</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nombre de usuario</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Correo electrónico</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Rol</label>
                    <select
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                    >
                        <option value="">Selecciona un rol</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded font-semibold"
                >
                    {loading ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </form>
        </div>
    );
};

export default UserEdit;
