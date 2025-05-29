import { useState, useEffect } from 'react';
import { Home, FileText, MessageCircle, User, Menu, X, Briefcase, CreditCard, CheckCircle, Upload, Crown, Send } from 'lucide-react';
import agreementIcon from '../../assets/agreement.jpg';
import backendUrl from '../../utils/backendUrl';
import { useNavigate } from 'react-router-dom';
import MessageNotifications from '../../components/MessageNotifications';

const WelcomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showBrandsList, setShowBrandsList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await backendUrl.get('auth/influencer-register/me/');
      console.log("hi", response.data);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageBrands = () => {
    setShowBrandsList(true);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleStripeSetup = async () => {
    setIsLoadingStripe(true);
    try {
      const response = await backendUrl.post('api/influencers/stripe-onboarding/');
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error setting up Stripe account:', error);
      alert('Failed to set up Stripe account. Please try again.');
    } finally {
      setIsLoadingStripe(false);
    }
  };

  // Check if user has Pro subscription
  const isProSubscriber = userProfile?.is_subscribed && userProfile?.subscription_plan === 'pro';

  // If showing brands list, render the MessageBrands component
  if (showBrandsList) {
    navigate('/MessageBrands')
  }

  return (
    <div className="flex flex-col min-h-screen bg-pink-50 font-outfit">
      {/* Header */}
      <header className="p-4 bg-white sticky top-0 z-20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">
            <div className="flex items-center justify-between">
              {/* Logo and Title */}
              <div className="flex items-center">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden mr-2 lg:mr-3">
                  <img src={agreementIcon} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-lg lg:text-xl font-semibold text-gray-800">TikPartner</h1>
              </div>
              {/* Notification icon & menu toggle for MOBILE */}
              <div className="flex items-center lg:hidden">
                <MessageNotifications />
                <button 
                  className="p-2 cursor-pointer" 
                  onClick={toggleMobileMenu}
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
            
            {/* Desktop Navigation - Now in the header for lg */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="/WelcomePage" className="flex items-center text-pink-500">
                <Home className="w-5 h-5 mr-1" />
                <span>Home</span>
              </a>
              <a href="/InfContracts" className="flex items-center text-gray-500">
                <FileText className="w-5 h-5 mr-1" />
                <span>Contracts</span>
              </a>
              <a href="/ConversationList" className="flex items-center text-gray-500">
                <MessageCircle className="w-5 h-5 mr-1" />
                <span>Message</span>
              </a>
              <a href="/MyPortfolioPage" className="flex items-center text-gray-500">
                <Briefcase className="w-5 h-5 mr-1" />
                <span>My Portfolio</span>
              </a>
              <a href="/MySubscriptionPage" className="flex items-center text-gray-500">
                <Crown className="w-5 h-5 mr-1" />
                <span>My Subscription</span>
              </a>
              <a href="/profile" className="flex items-center text-gray-500">
                <User className="w-5 h-5 mr-1" />
                <span>Profile</span>
              </a>
              {/* Notification bell for desktop */}
              <MessageNotifications />
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-pink-50 z-10 pt-16 lg:hidden">
          <nav className="flex flex-col p-4">
            <a href="/WelcomePage" className="flex items-center p-3 text-pink-500 border-b" onClick={toggleMobileMenu}>
              <Home className="w-6 h-6 mr-3" />
              <span>Home</span>
            </a>
            <a href="/InfContracts" className="flex items-center p-3 text-gray-500 border-b" onClick={toggleMobileMenu}>
              <FileText className="w-6 h-6 mr-3" />
              <span>Contracts</span>
            </a>
            <a href="/ConversationList" className="flex items-center p-3 text-gray-500 border-b" onClick={toggleMobileMenu}>
              <MessageCircle className="w-6 h-6 mr-3" />
              <span>Message</span>
            </a>
            <a href="/MyPortfolioPage" className="flex items-center p-3 text-gray-500 border-b" onClick={toggleMobileMenu}>
              <Briefcase className="w-6 h-6 mr-3" />
              <span>My Portfolio</span>
            </a>
            <a href="/MySubscriptionPage" className="flex items-center p-3 text-gray-500 border-b" onClick={toggleMobileMenu}>
              <Crown className="w-6 h-6 mr-3" />
              <span>My Subscription</span>
            </a>
            <a href="/profile" className="flex items-center p-3 text-gray-500" onClick={toggleMobileMenu}>
              <User className="w-6 h-6 mr-3" />
              <span>Profile</span>
            </a>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow p-4 md:container md:mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-normal mb-4 md:mb-8">Set up your Account/Profile</h2>
        
        {/* Action Buttons Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          {/* Set up Stripe Account Button */}
          <button
            onClick={handleStripeSetup}
            disabled={isLoading || isLoadingStripe || userProfile?.onboarded}
            className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {userProfile?.onboarded ? (
              <CheckCircle className="w-10 h-10 mr-3 text-green-500" />
            ) : (
              <CreditCard className="w-6 h-6 mr-3 text-pink-500" />
            )}
            
            <div className="text-left">
              {userProfile?.onboarded ? (
                <div className="text-sm text-gray-500">
                  You have connected and onboarded your Stripe account to the platform. You're all set!
                </div>
              ) : (
                <>
                  <div className="font-medium text-gray-800">
                    {isLoadingStripe ? 'Setting up...' : 'Set up Stripe account'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Connect your bank account to receive payments
                  </div>
                </>
              )}
            </div>
          </button>

          {/* Submit Portfolio Button */}
          <button
            onClick={() => navigate('/SubmitPortfolioPage')} 
            disabled={isLoading}
            className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <Upload className="w-6 h-6 mr-3 text-pink-500" />
            <div className="text-left">
              <div className="font-medium text-gray-800">Submit Portfolio</div>
              <div className="text-sm text-gray-500">
                Upload your work to attract brand partnerships
              </div>
            </div>
          </button>
        </div>

        {/* Pro Subscriber Feature - Message Brands */}
        {isProSubscriber && (
          <div className="mt-8">
            <div className="bg-gradient-to-r from-pink-500 to-pink-400 rounded-lg p-6 text-white">
              <div className="flex items-center mb-4">
                <Crown className="w-6 h-6 mr-2" />
                <h3 className="text-xl font-semibold">Pro Feature</h3>
              </div>
              <p className="mb-4">As a Pro subscriber, you can directly message brands to start conversations and collaborations!</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleMessageBrands}
                  className="flex items-center justify-center px-6 py-3 bg-white text-pink-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer font-medium"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Message Brands
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Show subscription prompt for non-Pro users */}
        {userProfile && !isProSubscriber && (
          <div className="mt-8">
            <div className="bg-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300">
              <div className="flex items-center mb-4">
                <Crown className="w-6 h-6 mr-2 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600">Unlock Pro Features</h3>
              </div>
              <p className="text-gray-600 mb-4">Upgrade to Pro to directly message brands and unlock exclusive collaboration opportunities!</p>
              <button
                onClick={() => navigate('/MySubscriptionPage')}
                className="flex items-center px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-200 cursor-pointer font-medium"
              >
                <Crown className="w-5 h-5 mr-2" />
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}

        {!userProfile && (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-7 w-7 md:h-10 md:w-10 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        )}

      </main>
    </div>
  );
};

export default WelcomePage;