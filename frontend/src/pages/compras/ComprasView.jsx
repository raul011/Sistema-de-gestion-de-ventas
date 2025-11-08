import React, { useEffect, useState } from 'react';
import api from '../../api/axios'; // tu instancia axios
import { Link } from 'react-router-dom'; // ✅ IMPORT NECESARIO

const ComprasView = () => {
    const [compras, setCompras] = useState([]);

    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const res = await api.get('/compras/');
                //console.log('proveedor', res.data.results);
                setCompras(res.data.results);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCompras();
    }, []);

    return (
        <div className="p-6 min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Compras</h1>

            <Link
                to="/dashboard/compras/add"
                className="inline-block mb-6 px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
                Agregar Compra
            </Link>

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {compras.map(c => (
                            <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{c.proveedor_nombre}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">${c.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{c.fecha}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link
                                        to={`/dashboard/compras/${c.id}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Ver
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

};

export default ComprasView;
