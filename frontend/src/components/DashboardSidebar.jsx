import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // asegúrate de importar tu contexto
import { useState } from 'react';

const DashboardSidebar = () => {
  const { user } = useAuth(); // obtenemos el usuario y su rol
  // Estado para submenús

  // Estado para submenús
  const [usuariosOpen, setUsuariosOpen] = useState(false);
  const [rolesOpen, setRolesOpen] = useState(false);
  const [permisosOpen, setPermisosOpen] = useState(false);
  const [proveedoresOpen, setProveedoresOpen] = useState(false);
  return (
    <aside className="w-64 bg-gray-800 text-gray-100 flex flex-col h-screen">
      <div className="p-6 text-xl font-bold border-b border-gray-700">
        Mi Panel
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          to="/dashboard"
          className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors"
        >
          Inicio
        </Link>

        {/* Solo Admin */}
        {user?.role === 'Admin' && (
          <>
            {/* Usuarios */}
            <div>
              <button
                onClick={() => setUsuariosOpen(!usuariosOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Usuarios
                <span className={`transform transition-transform ${usuariosOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
              </button>
              {usuariosOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link to="/dashboard/users/add" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Agregar
                  </Link>
                  <Link to="/dashboard/users/delete" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Eliminar
                  </Link>
                  <Link to="/dashboard/users/ver" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Ver
                  </Link>
                </div>
              )}
            </div>

            {/* Roles */}
            <div>
              <button
                onClick={() => setRolesOpen(!rolesOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Roles
                <span className={`transform transition-transform ${rolesOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
              </button>
              {rolesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link to="/dashboard/roles/add" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Agregar
                  </Link>

                  <Link to="/dashboard/roles/delete" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Eliminar
                  </Link>
                  <Link to="/dashboard/roles/ver" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Ver
                  </Link>
                </div>
              )}
            </div>

            {/* Permisos */}
            <div>
              <button
                onClick={() => setPermisosOpen(!permisosOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Permisos
                <span className={`transform transition-transform ${permisosOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
              </button>
              {permisosOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link to="/dashboard/permissions/add" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Agregar
                  </Link>
                  <Link to="/dashboard/permissions/delete" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Eliminar
                  </Link>
                  <Link to="/dashboard/permissions/ver" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Ver
                  </Link>
                </div>
              )}
            </div>

            {/* Proveedores */}
            <div>
              <button
                onClick={() => setProveedoresOpen(!proveedoresOpen)}
                className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 flex justify-between items-center transition-colors"
              >
                Proveedores
                <span className={`transform transition-transform ${proveedoresOpen ? 'rotate-180' : 'rotate-0'}`}>&#9660;</span>
              </button>
              {proveedoresOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link to="/dashboard/proveedores/add" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Agregar
                  </Link>
                  <Link to="/dashboard/proveedores/delete" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Eliminar
                  </Link>
                  <Link to="/dashboard/proveedores/ver" className="block py-1 px-2 rounded hover:bg-gray-700">
                    Ver
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
