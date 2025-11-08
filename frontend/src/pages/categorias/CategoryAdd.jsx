import React, { useState } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const CategoryAdd = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // FormData para enviar archivos
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (image) formData.append('image', image);

        try {
            await api.post('/products/categories/add/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/dashboard/categories'); // Volver a la lista
        } catch (err) {
            console.error('Error al agregar categoría:', err);
        }
    };
    return (
        <div className="p-4 bg-white">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Agregar Categoría</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded text-gray-800"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Descripción</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded text-gray-800"
                    />
                </div>
                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Imagen</label>
                    <input
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="w-full border border-gray-300 px-3 py-2 rounded cursor-pointer text-gray-800 hover:bg-gray-100"
                        accept="image/*"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Crear
                </button>
            </form>
        </div>
    );
};

export default CategoryAdd;
