import { useState } from 'react';
import { User, Mail, Calendar, LogOut, Shield, Settings, Crown, Star, Activity } from 'lucide-react';

export default function UserDashboard({ user, onLogout, loading }) {
  const [activeTab, setActiveTab] = useState('overview');

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = [
    { label: 'Projects', value: '12', icon: Activity, color: 'text-blue-600' },
    { label: 'Tasks Completed', value: '48', icon: Star, color: 'text-green-600' },
    { label: 'Team Members', value: '6', icon: User, color: 'text-purple-600' },
    { label: 'Hours Logged', value: '156', icon: Calendar, color: 'text-orange-600' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gray-100 rounded-2xl p-8 shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 bg-gradient-to-r from-black to-gray-800 rounded-full flex items-center justify-center mx-auto">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1">
              <Crown className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back, {user.name}!</h1>
          <p className="text-gray-600">Manage your account and view your activity</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-200 rounded-xl p-1">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {[
                    { action: 'Completed project "Website Redesign"', time: '2 hours ago', type: 'success' },
                    { action: 'Updated profile information', time: '1 day ago', type: 'info' },
                    { action: 'Joined team "Development"', time: '3 days ago', type: 'info' },
                    { action: 'Created new task "API Integration"', time: '1 week ago', type: 'warning' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'success' ? 'bg-green-500' :
                          activity.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <span className="text-gray-700">{activity.action}</span>
                      </div>
                      <span className="text-gray-500 text-sm">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Email Address</h3>
                </div>
                <p className="text-gray-700 text-lg">{user.email}</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-emerald-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Member Since</h3>
                </div>
                <p className="text-gray-700">{formatDate(user.created_at)}</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <Shield className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">Account Status</h3>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                  Active
                </span>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <Settings className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-800">User ID</h3>
                </div>
                <p className="text-gray-700 text-sm font-mono bg-gray-100 px-3 py-2 rounded border border-gray-200 break-all">
                  {user.id}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Preferences</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Email Notifications', enabled: true },
                    { label: 'Push Notifications', enabled: false },
                    { label: 'Two-Factor Authentication', enabled: true },
                    { label: 'Marketing Emails', enabled: false }
                  ].map((setting, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{setting.label}</span>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        setting.enabled ? 'bg-black' : 'bg-gray-400'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          setting.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-gray-800 transition-colors">
                    Change Password
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 hover:text-gray-800 transition-colors">
                    Download Data
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 hover:text-red-800 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="pt-6 border-t border-gray-200 mt-8">
          <button
            onClick={onLogout}
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center">
              <LogOut className="w-5 h-5 mr-2" />
              {loading ? 'Signing Out...' : 'Sign Out'}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}