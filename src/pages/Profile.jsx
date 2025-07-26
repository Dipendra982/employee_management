import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Building2, UserCircle, Calendar, DollarSign, Briefcase } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-blue-600 h-32"></div>
        <div className="px-6 py-4 -mt-16">
          <div className="flex justify-center">
            <div className="p-6 bg-white rounded-full shadow-lg">
              <UserCircle size={64} className="text-blue-600" />
            </div>
          </div>
          
          <div className="text-center mt-4">
            <h2 className="text-2xl font-semibold text-gray-900">{user && user.name}</h2>
            <p className="text-gray-600">{user && user.position}</p>
          </div>

          <div className="mt-6 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 flex items-center">
                <dt className="flex items-center text-gray-500 w-1/3">
                  <User className="h-5 w-5 mr-2" />
                  Full Name
                </dt>
                <dd className="text-gray-900">{user && user.name}</dd>
              </div>

              <div className="py-4 flex items-center">
                <dt className="flex items-center text-gray-500 w-1/3">
                  <Mail className="h-5 w-5 mr-2" />
                  Email
                </dt>
                <dd className="text-gray-900">{user && user.email}</dd>
              </div>

              <div className="py-4 flex items-center">
                <dt className="flex items-center text-gray-500 w-1/3">
                  <Building2 className="h-5 w-5 mr-2" />
                  Department
                </dt>
                <dd className="text-gray-900">{user && user.department}</dd>
              </div>

              <div className="py-4 flex items-center">
                <dt className="flex items-center text-gray-500 w-1/3">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Position
                </dt>
                <dd className="text-gray-900">{user && user.position}</dd>
              </div>

              <div className="py-4 flex items-center">
                <dt className="flex items-center text-gray-500 w-1/3">
                  <Calendar className="h-5 w-5 mr-2" />
                  Joining Date
                </dt>
                <dd className="text-gray-900">{user && user.joiningDate}</dd>
              </div>

              <div className="py-4 flex items-center">
                <dt className="flex items-center text-gray-500 w-1/3">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Salary
                </dt>
                <dd className="text-gray-900">
                  {user && user.salary ? `$${user.salary.toLocaleString()}/year` : ''}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
  
