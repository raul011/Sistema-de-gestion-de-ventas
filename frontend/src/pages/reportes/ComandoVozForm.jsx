// src/pages/reportes/ComandoVozForm.jsx
import React, { useState } from 'react';
import api from '../../api/axios';

const ComandoVozForm = () => {
  const [texto, setTexto] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleEnviar = async () => {
    try {
      const res = await api.post('/reportes/comandos-voz/procesar/', { texto });
      setMensaje('Comando registrado con ID: ' + res.data.id);
    } catch (err) {
      console.error(err);
      setMensaje('Error al registrar comando');
    }
  };

  return (
    <div>
      <h2>Registrar Comando de Voz</h2>
      <input
        type="text"
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Ej: Generar reporte de ventas"
      />
      <button onClick={handleEnviar}>Enviar</button>
      <p>{mensaje}</p>
    </div>
  );
};

export default ComandoVozForm;
