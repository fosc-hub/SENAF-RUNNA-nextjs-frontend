import React, { useState } from 'react';
import { Bell, LogOut, User as UserIcon } from 'lucide-react';
import UserAvatar from './UserAvatar';
import SearchBar from './SearchBar.tsx';
import { toast } from 'react-toastify'; // Ensure react-toastify is installed
import 'react-toastify/dist/ReactToastify.css'; // Toast styles
import axiosInstance from '../../api/utils/axiosInstance';
import Cookies from 'js-cookie';
import { logout } from '../../auth/index';


export default function Header({ user }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
  
      // Show success toast
      toast.success('Successfully logged out');
  
      // Redirect to login
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };  

  return (
    <header className="bg-sky-500 text-white p-4 flex justify-between items-center">
      <UserAvatar
        initials={user.initials}
        name={user.name}
        role={user.role}
        legajo={user.legajo}
      />
      <div className="flex items-center space-x-4">
        <SearchBar />
        <Bell size={24} />
        <div className="relative">
          <button
            className="flex items-center space-x-2 bg-sky-600 hover:bg-sky-700 px-3 py-2 rounded text-sm"
            onClick={() => setShowMenu(!showMenu)}
          >
            <UserIcon size={18} />
            <span>Menu</span>
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
