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
    const [user, setUser] = useState(() => {
      // Retrieve user data from localStorage if available
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const fetchUser = async () => {
          try {
            const userData = await getUsers()
            setUser(userData);
            try {
              localStorage.setItem('user', JSON.stringify(userData));
            } catch (storageError) {
              console.error("Error writing to localStorage:", storageError);
            }
          } catch (err) {
            setUser(null);
            try {
              localStorage.removeItem('user');
            } catch (storageError) {
              console.error("Error removing from localStorage:", storageError);
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
