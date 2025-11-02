import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';

const RolesContext = createContext();

export const RolesProvider = ({ children }) => {
  const [roles, setRoles] = useState([]);

  const fetchRoles = async () => {
    try {
      const res = await axios.get('/roles/');
      setRoles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <RolesContext.Provider value={{ roles, fetchRoles }}>
      {children}
    </RolesContext.Provider>
  );
};

export const useRoles = () => useContext(RolesContext);
