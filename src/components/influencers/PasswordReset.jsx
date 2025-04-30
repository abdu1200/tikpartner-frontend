import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const PasswordReset = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState('');
  const [token, setToken] = useState('');
  const [initialized, setInitialized] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
    
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Extract uid and token from URL when component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uidParam = urlParams.get('uid');
    const tokenParam = urlParams.get('token');
    
    if (uidParam && tokenParam) {
      setUid(uidParam);
      setToken(tokenParam);
      setInitialized(true);
    } else {
      setError('No uid or token on the reset url from email. Please request a new one.');
    }
  }, []);

  const handleConfirmReset = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (newPassword !== confirmPassword) {
      setError('Passwords don\'t match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(
        'https://tikbackend.onrender.com/auth/password-reset/confirm/',
        {
          uid,
          token,
          new_password: newPassword,
          confirm_password: confirmPassword
        }
      );
      
      setMessage(response.data.detail || 'Password has been reset successfully.');
      setNewPassword('');
      setConfirmPassword('');
      
      
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'There was a problem resetting your password. The link may have expired or used already. or the user for uid is invalid(or not there on the db)'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate('/InfluencerLogin');
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-full max-w-md mx-auto px-4 py-8 md:py-12">
        {/* Back button */}
        <button 
          onClick={handleGoBack}
          className="flex items-center text-gray-700 mb-6 hover:text-pink-600 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to login
        </button>
        
        <h1 className="text-2xl font-medium text-gray-800 mb-8">Set new password</h1>
        
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {!initialized ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="newPassword">
                New password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-6 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="confirmPassword">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-6 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleConfirmReset}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:opacity-50 mt-4 transition-colors cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Setting password...' : 'Reset password'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;