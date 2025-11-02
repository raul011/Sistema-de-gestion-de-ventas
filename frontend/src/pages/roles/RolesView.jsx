import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const RolesView = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // ← aquí lo defines
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await api.get('/roles/ver/'); // endpoint del backend
                // Como el backend devuelve un array directamente, podemos asignarlo a roles
                console.log('Respuesta del backend:', res.data);
                setRoles(res.data);
            } catch (err) {
                console.error('Error al obtener roles:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoles();
    }, []);

    if (loading) return <p>Cargando roles...</p>;
    return (
        <div className="p-6 bg-black-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Roles</h1>
            <table className="w-full border border-gray-400 bg-gray-800 text-gray-100 rounded-lg overflow-hidden">
                <thead className="bg-gray-700 text-white">
                    <tr>
                        <th className="p-2 border border-gray-600 text-left">Nombre</th>
                        <th className="p-2 border border-gray-600 text-left">Permisos</th>
                        <th className="p-2 border border-gray-600 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {roles.map((role) => (
                        <tr key={role.id} className="hover:bg-gray-600">
                            <td className="p-2 border border-gray-600">{role.name}</td>
                            <td className="p-2 border border-gray-600">
                                {role.permissions && role.permissions.length > 0
                                    ? role.permissions.map((perm) => perm.name).join(', ')
                                    : 'Sin permisos'}
                            </td>
                            <td className="p-2 border border-gray-600 text-center space-x-2">

                                <button
                                    onClick={() => navigate(`/dashboard/roles/edit/${role.id}`)}
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

export default RolesView;
