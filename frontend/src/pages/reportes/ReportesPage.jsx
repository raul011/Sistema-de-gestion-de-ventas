// src/pages/reportes/ReportesPage.jsx
import React from 'react';
import ReporteGenerar from './ReporteGenerar';
import ReporteList from './ReporteList';
import ComandoVozForm from './ComandoVozForm';

const ReportesPage = () => {
  return (
    <div>
      <h1>Módulo de Reportes</h1>
      <ReporteGenerar />
      <ReporteList />
      <ComandoVozForm />
    </div>
  );
};

export default ReportesPage;
