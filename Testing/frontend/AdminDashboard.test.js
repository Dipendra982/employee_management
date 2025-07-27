import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../../src/pages/admin/AdminDashboard';
import { AuthProvider } from '../../src/contexts/AuthContext';

// Mock the API
global.fetch = jest.fn();

// Mock the AuthContext
const mockAuthContext = {
  user: { id: 1, name: 'Admin User', role: 'admin' },
  loading: false
};

jest.mock('../../src/contexts/AuthContext', () => ({
  ...jest.requireActual('../../src/contexts/AuthContext'),
  useAuth: () => mockAuthContext
}));

const renderAdminDashboard = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <AdminDashboard />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AdminDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard title', () => {
    renderAdminDashboard();
    
    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    renderAdminDashboard();
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('fetches and displays dashboard data', async () => {
    const mockStatsResponse = {
      ok: true,
      json: () => Promise.resolve({
        totalUsers: 10,
        totalTasks: 25,
        totalAttendance: 8,
        totalLeaves: 3
      })
    };

    const mockUsersResponse = {
      ok: true,
      json: () => Promise.resolve({
        data: [
          { id: 1, name: 'User 1', role: 'staff' },
          { id: 2, name: 'User 2', role: 'staff' }
        ]
      })
    };

    fetch
      .mockResolvedValueOnce(mockStatsResponse)
      .mockResolvedValueOnce(mockUsersResponse);

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // Total Users
      expect(screen.getByText('25')).toBeInTheDocument(); // Total Tasks
      expect(screen.getByText('8')).toBeInTheDocument();  // Total Attendance
      expect(screen.getByText('3')).toBeInTheDocument();  // Total Leaves
    });
  });

  test('handles API errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByText(/error loading dashboard data/i)).toBeInTheDocument();
    });
  });

  test('displays recent users section', async () => {
    const mockStatsResponse = {
      ok: true,
      json: () => Promise.resolve({
        totalUsers: 5,
        totalTasks: 10,
        totalAttendance: 3,
        totalLeaves: 1
      })
    };

    const mockUsersResponse = {
      ok: true,
      json: () => Promise.resolve({
        data: [
          { id: 1, name: 'John Doe', role: 'staff', email: 'john@example.com' },
          { id: 2, name: 'Jane Smith', role: 'staff', email: 'jane@example.com' }
        ]
      })
    };

    fetch
      .mockResolvedValueOnce(mockStatsResponse)
      .mockResolvedValueOnce(mockUsersResponse);

    renderAdminDashboard();

    await waitFor(() => {
      expect(screen.getByText(/recent users/i)).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });
});
