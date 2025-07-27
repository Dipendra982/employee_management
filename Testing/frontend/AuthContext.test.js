import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../src/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Test component to use AuthContext
const TestComponent = () => {
  const { user, login, logout, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not loading'}</div>
      <button data-testid="login" onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button data-testid="logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

const renderWithAuth = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{component}</AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  test('provides initial auth state', () => {
    renderWithAuth(<TestComponent />);
    
    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
  });

  test('handles successful login', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        token: 'mock-token',
        user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'staff' }
      })
    };
    fetch.mockResolvedValueOnce(mockResponse);

    renderWithAuth(<TestComponent />);
    
    const loginButton = screen.getByTestId('login');
    loginButton.click();

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token');
    });
  });

  test('handles logout', async () => {
    localStorageMock.getItem.mockReturnValue('mock-token');
    
    renderWithAuth(<TestComponent />);
    
    const logoutButton = screen.getByTestId('logout');
    logoutButton.click();

    await waitFor(() => {
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });
  });

  test('loads user from token on mount', async () => {
    localStorageMock.getItem.mockReturnValue('mock-token');
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({
        user: { id: 1, name: 'Test User', email: 'test@example.com', role: 'staff' }
      })
    };
    fetch.mockResolvedValueOnce(mockResponse);

    renderWithAuth(<TestComponent />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth/me'), {
        headers: { Authorization: 'Bearer mock-token' }
      });
    });
  });
});
