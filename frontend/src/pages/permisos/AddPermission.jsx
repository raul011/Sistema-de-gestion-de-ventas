import React, { useState } from 'react';
import api from '../../api/axios';

const AddPermission = () => {
    const [name, setName] = useState('');
    const [codename, setCodename] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name || !codename) {
            setError('Debes completar todos los campos');
            return;
        }

        setLoading(true);

        try {
            // Usando Axios desde tu api configurado
            const res = await api.post('/roles/permissions/ver/', { name, codename });

            setSuccess(`Permiso "${res.data.name}" creado correctamente`);
            setName('');
            setCodename('');
        } catch (err) {
            // Axios almacena el error en err.response
            if (err.response && err.response.data) {
                // Por ejemplo: { name: ["Este campo ya existe."] }
                const messages = Object.values(err.response.data)
                    .flat()
                    .join(' ');
                setError(messages);
            } else {
                setError('Error al crear el permiso');
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-6 text-gray-900">
            <h1 className="text-2xl font-bold mb-4">Agregar Permiso</h1>
            <form onSubmit={handleSubmit} className="max-w-md space-y-4">
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}

                <div>
                    <label className="block mb-1 font-semibold">Nombre del permiso</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2 w-full rounded text-gray-900 placeholder-gray-500"
                        placeholder="Ingresa el nombre del permiso"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Código del permiso</label>
                    <input
                        type="text"
                        value={codename}
                        onChange={(e) => setCodename(e.target.value)}
                        className="border p-2 w-full rounded text-gray-900 placeholder-gray-500"
                        placeholder="Ingresa el código único"
                    />
                </div>

                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Guardando...' : 'Guardar permiso'}
                </button>
            </form>
        </div>
    );
};

export default AddPermission;
