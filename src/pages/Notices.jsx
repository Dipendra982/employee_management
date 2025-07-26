import React from 'react';
import { Bell, AlertCircle, Info } from 'lucide-react';

const Notices = () => {
  const notices = [
    {
      id: '1',
      title: 'Salary Revision Notice',
      content: 'Annual salary revisions will be effective from April 1st, 2024.',
      date: '2024-03-15',
      type: 'important'
    },
    {
      id: '2',
      title: 'Holiday Announcement',
      content: 'Office will remain closed on March 25th for spring festival.',
      date: '2024-03-10',
      type: 'announcement'
    },
    {
      id: '3',
      title: 'New Attendance Policy',
      content: 'Updated attendance policy will be implemented from next month.',
      date: '2024-03-05',
      type: 'info'
    }
  ];

  const getNoticeIcon = (type) => {
    switch (type) {
      case 'important': return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      case 'announcement': return <Bell className="h-5 w-5 text-yellow-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Company Notices</h1>
        
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getNoticeIcon(notice.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{notice.title}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(notice.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{notice.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notices;