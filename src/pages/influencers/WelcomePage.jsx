import { useState } from 'react';
import { Home, FileText, MessageCircle, User, Menu, X, Briefcase, CreditCard, Upload } from 'lucide-react';
import agreementIcon from '../../assets/agreement.jpg';
import backendUrl from '../../utils/backendUrl';
import { useNavigate } from 'react-router-dom';
import MessageNotifications from '../../components/MessageNotifications';


const WelcomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoadingStripe, setIsLoadingStripe] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleStripeSetup = async () => {
    setIsLoadingStripe(true);
    try {
      const response = await backendUrl.post('api/influencers/stripe-onboarding/');
      
      if (response.data.url) {
        // Redirect to Stripe onboarding
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Error setting up Stripe account:', error);
      alert('Failed to set up Stripe account. Please try again.');
    } finally {
      setIsLoadingStripe(false);
    }
  };

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
            disabled={isLoadingStripe}
            className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <CreditCard className="w-6 h-6 mr-3 text-pink-500" />
            <div className="text-left">
              <div className="font-medium text-gray-800">
                {isLoadingStripe ? 'Setting up...' : 'Set up Stripe account'}
              </div>
              <div className="text-sm text-gray-500">
                Connect your bank account to receive payments
              </div>
            </div>
          </button>

          {/* Submit Portfolio Button */}
          <button
            onClick={() => navigate('/SubmitPortfolioPage')} 
            className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
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
      </main>
    </div>
  );
};

export default WelcomePage;