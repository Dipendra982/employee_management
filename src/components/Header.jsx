import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Users, UserCircle, Calendar, Bell, LogOut } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-blue-600">
            StaffManager
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
              <Users className="h-5 w-5 mr-1" />
              Dashboard
            </Link>
            {user?.role === 'admin' && (
              <Link to="/staff" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
                <Users className="h-5 w-5 mr-1" />
                Staff
              </Link>
            )}
            <Link to="/attendance" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
              <Calendar className="h-5 w-5 mr-1" />
              Attendance
            </Link>
            <Link to="/notices" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
              <Bell className="h-5 w-5 mr-1" />
              Notices
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
              <UserCircle className="h-5 w-5 mr-1" />
              Profile
            </Link>
            <button
              onClick={logout}
              className="text-gray-700 hover:text-red-600 transition-colors flex items-center"
            >
              <LogOut className="h-5 w-5 mr-1" />
              Logout
            </button>
          </nav>
          
          <button 
            className="md:hidden text-gray-700"
            onClick={toggleMobileMenu}
          >
            <Menu size={24} />
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
          <div className="pt-4 pb-3 space-y-3">
            <Link to="/dashboard" className="block text-gray-700 hover:text-blue-600 transition-colors">Dashboard</Link>
            {user?.role === 'admin' && (
              <Link to="/staff" className="block text-gray-700 hover:text-blue-600 transition-colors">Staff</Link>
            )}
            <Link to="/attendance" className="block text-gray-700 hover:text-blue-600 transition-colors">Attendance</Link>
            <Link to="/notices" className="block text-gray-700 hover:text-blue-600 transition-colors">Notices</Link>
            <Link to="/profile" className="block text-gray-700 hover:text-blue-600 transition-colors">Profile</Link>
            <button
              onClick={logout}
              className="block text-gray-700 hover:text-red-600 transition-colors w-full text-left"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;