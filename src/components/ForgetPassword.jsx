import { useState } from 'react';
import backendUrl from "../utils/backendUrl";


//for PasswordResetRequest
const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await backendUrl.post(
        '/auth/password-reset/',
        { email }
      );
      
      setMessage(response.data.detail || 'Password reset email has been sent.');
      setEmail('');
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'There was a problem sending the reset email. Please try again...the was a problem hitting the password-reset endpoint'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    // Navigate back or to login page
    // This would typically use your router navigation
    window.history.back();
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
        
        <h1 className="text-2xl font-medium text-gray-800 mb-8">Reset your password</h1>
        
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

        <div className="mb-6">
          <label className="block text-gray-700 text-sm mb-2" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>

        <button
          onClick={handleResetRequest}
          className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:opacity-50 mt-4 transition-colors cursor-pointer"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send me a new password'}
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;