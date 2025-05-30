import { useState, useEffect } from 'react';
import { Home, FileText, MessageCircle, User, Menu, X, Briefcase, Crown, Edit, CreditCard, AlertTriangle } from 'lucide-react';
import agreementIcon from '../../assets/agreement.jpg';
import { useNavigate } from 'react-router-dom';
import MessageNotifications from '../../components/MessageNotifications';
import backendUrl from '../../utils/backendUrl';


const ProfilePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await backendUrl.get('auth/influencer-register/me/');
      setUserProfile(response.data);
      setProfileImage(response.data.user.profile_picture || null);

    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };


  // Simple helper function to display image URL correctly
  const getImageDisplayUrl = (imageSource) => {
    // If no image source, return null
    if (!imageSource) return null;
    
    // If it's a data URL (file preview), return as is
    if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
      return imageSource;
    }
    
    // If it's already a complete URL, return as is
    if (typeof imageSource === 'string' && (imageSource.startsWith('http://') || imageSource.startsWith('https://'))) {
      return imageSource;
    }
    
    // If it's something else, try to use it directly
    return imageSource;
  };


  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleReconnectStripe = () => {
    // Handle Stripe reconnection
    console.log('Reconnect Stripe clicked');
    // This could trigger a new Stripe onboarding flow
  };

  const handleDisputeManagement = () => {
    // Navigate to dispute management page
    console.log('Dispute management clicked');
    // navigate('/DisputeManagementPage');
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
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <a href="/WelcomePage" className="flex items-center text-gray-500">
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
              <a href="/InfMyProfilePage" className="flex items-center text-gray-500">
              {profileImage ? (
                <img
                  src={getImageDisplayUrl(userProfile?.user?.profile_picture)}
                  alt="Profile preview"
                  className="w-7 h-7 rounded-full object-cover border-2 border-gray-300 mr-1"
                /> ) : ( <User className="w-5 h-5 mr-1" /> )}
                <span>Profile</span>
              </a>
              <MessageNotifications />
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-pink-50 z-10 pt-16 lg:hidden">
          <nav className="flex flex-col p-4">
            <a href="/WelcomePage" className="flex items-center p-3 text-gray-500 border-b" onClick={toggleMobileMenu}>
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
            <a href="/InfMyProfilePage" className="flex items-center p-3 text-gray-500" onClick={toggleMobileMenu}>
            {profileImage ? (
              <img
                src={getImageDisplayUrl(profileImage)}
                alt="Profile preview"
                className="w-7 h-7 rounded-full object-cover border-2 border-gray-300 mr-3"
              /> ) : (<User className="w-5 h-5 mr-1" />)}
              <span>Profile</span>
            </a>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow p-4 md:container md:mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-normal mb-4 md:mb-8">Profile Management</h2>
        
        {userProfile && 
         <div className="grid grid-cols-1 gap-4 max-w-2xl">
          
          {/* Update Profile Info Button */}
          <button
            onClick={() => navigate('/InfluencerUpdate')}
            className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <Edit className="w-6 h-6 mr-3 text-pink-500" />
            <div className="text-left flex-1">
              <div className="font-medium text-gray-800">Update Your Profile Info</div>
              <div className="text-sm text-gray-500">
                Edit your personal information, bio, and account details
              </div>
            </div>
          </button>

          {/* Reconnect Stripe Account Button */}
          <button
            onClick={handleReconnectStripe}
            className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <CreditCard className="w-6 h-6 mr-3 text-pink-500" />
            <div className="text-left flex-1">
              <div className="font-medium text-gray-800">Reconnect Your Stripe Account</div>
              <div className="text-sm text-gray-500">
                Update your bank information or change payment settings
              </div>
            </div>
          </button>

          {/* Dispute Management Button */}
          <button
            onClick={handleDisputeManagement}
            className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <AlertTriangle className="w-6 h-6 mr-3 text-pink-500" />
            <div className="text-left flex-1">
              <div className="font-medium text-gray-800">Dispute Management</div>
              <div className="text-sm text-gray-500">
                Manage contract disputes and resolve issues with brands
              </div>
            </div>
          </button>
        </div> 
        
        }

        {!userProfile && (
          <div className="flex justify-center mt-20">
            <div className="animate-spin rounded-full h-7 w-7 md:h-10 md:w-10 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;