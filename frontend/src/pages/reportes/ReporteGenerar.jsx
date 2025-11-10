// src/pages/reportes/ReporteDinamico.jsx
import React, { useState } from 'react';
import api from '../../api/axios';

const ReporteDinamico = () => {
  const [prompt, setPrompt] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerar = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/reportes/reportes/dinamico/', {
        prompt,
      });
      console.log('reportes dinamicos', res?.data);
      setResultado(res.data);
    } catch (err) {
      console.error(err);
      setResultado({ error: 'No se pudo generar el reporte' });
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Generar Reporte Dinámico</h2>

      <div className="bg-gray-50 p-4 rounded-lg shadow-md space-y-4">
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Escribe aquí tu instrucción para generar el reporte..."
          className="w-full border rounded p-2 text-gray-800 resize-none h-32"
        />

        <button
          onClick={handleGenerar}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Generando...' : 'Generar Reporte'}
        </button>
      </div>

      {resultado && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Resultado:</h3>
          <pre className="text-gray-900 overflow-auto">{JSON.stringify(resultado, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ReporteDinamico;
