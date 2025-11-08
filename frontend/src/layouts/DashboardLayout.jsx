import DashboardSidebar from '../components/DashboardSidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <main className="p-6 flex-1 overflow-y-auto bg-write-1000">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
