import { useState } from 'react';
import backendUrl from '../../utils/backendUrl';
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setError(null);
    
    //handle authentication
    try {

      // Clear any existing tokens/data first
      localStorage.clear();

      const response = await backendUrl.post('/auth/login/', {
        email,
        password
      });
      
      // Check if the one logging is an influncer not a brand
      if (response.data.profile_type !== 'influencer') {
        alert('Access denied. You are not an influencer');
        return;
      }

      
      // Store tokens & user in localStorage or secure storage
      localStorage.setItem('accessToken', response.data.access);     // localStorage is a built-in Web API available globally in browsers, and a frontend code has access to the localStorage since the frontend code runs on the browser, unlike server codes like django who runs on a server machine
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.profile.user));
      localStorage.setItem('profile', JSON.stringify(response.data.profile));
      
      console.log('Login successful', response.data);
      // alert('Login successful!');
      
      navigate('/ConversationList');

      
    } catch (error) {
      console.log('Login error:', error);
      // Handle error - show error message to user

      setError(
        error.response?.data?.message || 
        error.message || 
        'Something went wrong. Please try again.'
      );

    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <div className="w-full min-h-screen py-[140px] px-[5px] md:bg-gray-50 md:flex md:flex-col md:items-center md:justify-center md:py-6 font-outfit">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto p-4 md:p-8 bg-white md:shadow-lg md:rounded-xl">
        <div className="text-center mb-[50px]">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-800">Tikpartner - Influencers</h1>
          <p className="mt-[8px] text-sm font-light md:text-lg">Login to your influencer account</p>
        </div>
        
        {/* Error Message if any */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <p className="font-medium mb-1">Invalid Credentials</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='mb-[20px]'>
            <label htmlFor="email" className="block mb-[0px] text-sm text-neutral-800  md:text-base font-medium ">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="mt-1 block h-[44px] w-full px-3 py-2 md:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 placeholder:text-sm  placeholder:font-light md:placeholder:text-lg"
              required
            />
          </div>
          
          <div className='mb-[37px]'>
            <label htmlFor="password" className="block text-sm md:text-base font-medium text-neutral-800">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a strong password"
                className="mt-1 block h-[44px] w-full px-3 py-2 md:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 placeholder:text-sm placeholder:font-light md:placeholder:text-lg"
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
              <div className="mt-2 text-right">
                <span
                  onClick={() => navigate('/ForgetPassword')}
                  className="text-sm md:text-base text-neutral-800 hover:text-pink-600 underline cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[56px] w-full flex justify-center items-center py-2 md:py-3 px-4 border border-transparent rounded-sm shadow-sm text-white text-md md:text-lg bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging...
                </div>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-[61px] text-center">
          <p className="text-sm font-light md:text-base">Don't have an account?</p>
          <button onClick={() => navigate('/InfluencerSignup')} className="w-full h-[56px] border-1  mt-[12px] border-pink-600 text-pink-600 py-3 px-6 rounded-sm text-md md:text-lg hover:bg-pink-50 transition-colors cursor-pointer">
              Signup
          </button>
        </div>
      </div>
    </div>
  );
}