import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Clock, CreditCard } from 'lucide-react';
import backendUrl from '../../utils/backendUrl';
import { useNavigate } from 'react-router-dom';


const StripeOnboardingComplete = () => {
    const [loading, setLoading] = useState(true);
    const [onboardingStatus, setOnboardingStatus] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      checkOnboardingStatus();
    }, []);
  
    const checkOnboardingStatus = async () => {
      setLoading(true);
      try {
        const response = await backendUrl.get('api/influencers/stripe-onboarding/');
        setOnboardingStatus(response.data);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setError('Failed to check onboarding status. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    const renderStatusContent = () => {
      if (loading) {
        return (
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Checking your account status...
            </h2>
            <p className="text-gray-600">
              Please wait while we verify your Stripe onboarding.
            </p>
          </div>
        );
      }
  
      if (error) {
        return (
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={checkOnboardingStatus}
              className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      }
  
      if (onboardingStatus?.onboarded) {
        return (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Successfully Connected!
            </h2>
            <p className="text-gray-600 mb-6">
              You have successfully connected your Stripe account. You're now ready to receive payments from brand partnerships.
            </p>
            
            {/* Account Status Details */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  <span>Account Status: Active</span>
                </div>
                {onboardingStatus.charges_enabled && (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Charges Enabled</span>
                  </div>
                )}
                {onboardingStatus.payouts_enabled && (
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span>Payouts Enabled</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="text-center">
            <Clock className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Onboarding Still Pending
            </h2>
            <p className="text-gray-600 mb-6">
              Your Stripe account setup is not yet complete. You may need to restart the setup from the home page & provide additional information or complete the verification process.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>Account Status:</strong> {onboardingStatus?.account_status || 'Pending'}
              </p>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors mr-3"
            >
              Refresh Status
            </button>
          </div>
        );
      }
    };
  
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col">
        {/* Header with back button */}
        <header className="p-4 bg-white">
          <div className="container mx-auto">
            <button
              onClick={navigate('/WelcomePage')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Home page</span>
            </button>
          </div>
        </header>
  
        {/* Main Content */}
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {/* Stripe Icon */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Stripe Setup</h1>
              </div>
  
              {/* Dynamic Content based on status */}
              {renderStatusContent()}
  
              {/* Return to Dashboard Button - only show when not loading */}
              {!loading && (
                <div className="text-center mt-6">
                  <button
                    onClick={navigate('/WelcomePage')}
                    className="text-pink-500 hover:text-pink-600 transition-colors font-medium"
                  >
                    Return to Home page
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  };
  
  export default StripeOnboardingComplete;