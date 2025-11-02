import { useEffect } from "react";
import { useAuth } from '../context/AuthContext';
const Dashboard = () => {
    useEffect(() => {
        console.log("✅ Entró al componente Dashboard.jsx");
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4 text-black">Panel principal</h1>
        </div>
    );

};

export default Dashboard;
