import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/DashboardSidebar';

const PrivateLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* Aquí se renderiza el contenido de las rutas privadas */}
      </main>
    </div>
  );
};

export default PrivateLayout;
