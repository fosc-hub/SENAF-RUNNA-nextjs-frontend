'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import { getUsers } from '../api/TableFunctions/user_me';

// Define the shape of the AuthContext value
interface AuthContextType {
  user: any; // Replace 'any' with a more specific type for your user object
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider to wrap the application
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Mover la inicialización de localStorage dentro del useEffect
      const savedUser = typeof window !== 'undefined' ? localStorage?.getItem('user') : null;
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      const fetchUser = async () => {
        try {
          const userData = await getUsers()
          setUser(userData);
          // Solo acceder a localStorage en el cliente
          if (typeof window !== 'undefined') {
            localStorage?.setItem('user', JSON.stringify(userData));
          }
        } catch (err) {
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage?.removeItem('user');
          }
        } finally {
          setLoading(false);
        }
      };
    
      fetchUser();
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};
  

// Custom hook to access the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
