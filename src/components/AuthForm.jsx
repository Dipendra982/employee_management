import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, Shield, Sparkles } from 'lucide-react';

export default function AuthForm({ onAuth, loading, error, actionType, setActionType }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (actionType === 'register') {
      if (!confirmPassword) {
        setConfirmPasswordError('Please confirm your password');
        return false;
      }
      if (confirmPassword !== password) {
        setConfirmPasswordError('Passwords do not match');
        return false;
      }
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (isEmailValid && isPasswordValid && isConfirmPasswordValid) {
      onAuth(email, password);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) validateEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) validatePassword(e.target.value);
    if (confirmPassword && actionType === 'register') {
      validateConfirmPassword(confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (confirmPasswordError) validateConfirmPassword(e.target.value);
  };

  const switchActionType = (type) => {
    setActionType(type);
    setConfirmPassword('');
    setConfirmPasswordError('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-100 rounded-2xl p-8 shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-black to-gray-800 rounded-full">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            {actionType === 'login' ? 'Welcome Back' : 'Create Account'}
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </h1>
          <p className="text-gray-600">
            {actionType === 'login' 
              ? 'Sign in to your account to continue' 
              : 'Join us today and get started'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={() => validateEmail(email)}
                  className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    emailError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              {emailError && (
                <p className="mt-2 text-sm text-red-500">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  onBlur={() => validatePassword(password)}
                  className={`w-full pl-10 pr-12 py-3 bg-white border rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    passwordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="mt-2 text-sm text-red-500">{passwordError}</p>
              )}
            </div>

            {/* Confirm Password Field (Register only) */}
            {actionType === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onBlur={() => validateConfirmPassword(confirmPassword)}
                    className={`w-full pl-10 pr-12 py-3 bg-white border rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      confirmPasswordError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="mt-2 text-sm text-red-500">{confirmPasswordError}</p>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Action Type Switcher */}
          <div className="flex space-x-2 p-1 bg-gray-200 rounded-xl">
            <button
              type="button"
              onClick={() => switchActionType('login')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                actionType === 'login'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'
              }`}
              disabled={loading}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchActionType('register')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                actionType === 'register'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-300'
              }`}
              disabled={loading}
            >
              Sign Up
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !email || !password || emailError || passwordError || confirmPasswordError}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
              actionType === 'login' 
                ? 'bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black shadow-lg hover:shadow-xl' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Processing...
              </div>
            ) : (
              actionType === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}