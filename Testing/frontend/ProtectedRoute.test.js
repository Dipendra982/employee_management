import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../../src/components/ProtectedRoute';
import { AuthProvider } from '../../src/contexts/AuthContext';

// Mock the AuthContext
const mockAuthContext = {
  user: null,
  loading: false
};

jest.mock('../../src/contexts/AuthContext', () => ({
  ...jest.requireActual('../../src/contexts/AuthContext'),
  useAuth: () => mockAuthContext
}));

// Test component
const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

const renderProtectedRoute = (allowedRoles = []) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ProtectedRoute allowedRoles={allowedRoles}>
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading when loading is true', () => {
    mockAuthContext.loading = true;
    mockAuthContext.user = null;
    
    renderProtectedRoute();
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    mockAuthContext.loading = false;
    mockAuthContext.user = null;
    
    renderProtectedRoute();
    
    // Should redirect to login (component won't render)
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('renders content when user is authenticated and no roles specified', () => {
    mockAuthContext.loading = false;
    mockAuthContext.user = { id: 1, name: 'Test User', role: 'staff' };
    
    renderProtectedRoute();
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  test('renders content when user has allowed role', () => {
    mockAuthContext.loading = false;
    mockAuthContext.user = { id: 1, name: 'Admin User', role: 'admin' };
    
    renderProtectedRoute(['admin']);
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  test('redirects when user does not have required role', () => {
    mockAuthContext.loading = false;
    mockAuthContext.user = { id: 1, name: 'Staff User', role: 'staff' };
    
    renderProtectedRoute(['admin']);
    
    // Should redirect (component won't render)
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  test('allows multiple roles', () => {
    mockAuthContext.loading = false;
    mockAuthContext.user = { id: 1, name: 'Staff User', role: 'staff' };
    
    renderProtectedRoute(['admin', 'staff']);
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });
});
