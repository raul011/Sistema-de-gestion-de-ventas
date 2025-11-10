// src/pages/reportes/ReporteList.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

const ReporteList = () => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const res = await api.get('/reportes/reportes/');
        setReportes(res.data.results);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReportes();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Reportes Generados</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportes.length === 0 ? (
          <p className="text-gray-600 col-span-full">No hay reportes generados aún.</p>
        ) : (
          reportes.map((r) => (
            <div
              key={r.id}
              className="border rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow bg-gray-50"
            >
              <p className="font-semibold text-gray-900">Tipo: {r.tipo_reporte}</p>
              <p className="text-gray-800">
                Fecha: {new Date(r.fecha_generacion).toLocaleString()}
              </p>
              <p className="text-gray-700">Formato: {r.formato}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReporteList;
