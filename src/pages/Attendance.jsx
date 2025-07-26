import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const Attendance = () => {
  const { user } = useAuth();
  const [currentMonth] = useState(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));

  const mockAttendance = [
    { date: '2024-03-01', checkIn: '09:00', checkOut: '17:00', status: 'present' },
    { date: '2024-03-02', checkIn: '09:15', checkOut: '17:00', status: 'late' },
    { date: '2024-03-03', checkIn: '', checkOut: '', status: 'absent' },
 
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Attendance Record</h1>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">{currentMonth}</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
          <div className="flex items-center space-x-4">
            <Clock className="h-6 w-6 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Today's Status</p>
              <p className="text-lg font-semibold">Check-in required</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Check In
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockAttendance.map((record, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.checkIn || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.checkOut || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;