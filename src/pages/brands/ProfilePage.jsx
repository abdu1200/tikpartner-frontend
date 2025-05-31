import { useState, useEffect } from 'react';
import { Home, FileText, MessageCircle, User, Menu, X, Briefcase, Crown, Edit, CreditCard, AlertTriangle, Search } from 'lucide-react';
import agreementIcon from '../../assets/agreement.jpg';
import { useNavigate } from 'react-router-dom';
import MessageNotifications from '../../components/MessageNotifications';
import { Link } from 'react-router-dom';


const ProfilePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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
              <Link to="/BrowseInfluencersPage" className="flex items-center text-gray-500 ">
                <Home className="w-5 h-5 mr-1" />
                <span>Home</span>
              </Link>
              <Link to="/SearchInfluencersPage" className="flex items-center text-gray-500">
                <Search className="w-5 h-5 mr-1" />
                <span>Search</span>
              </Link>
              <Link to="/Contracts" className="flex items-center text-gray-500">
                <FileText className="w-5 h-5 mr-1" />
                <span>Contracts</span>
              </Link>
              <Link to="/ConversationList" className="flex items-center text-gray-500">
                <MessageCircle className="w-5 h-5 mr-1" />
                <span>Message</span>
              </Link>
              <Link to="/MyProfilePage" className="flex items-center text-pink-500">
               <User className="w-5 h-5 mr-1" /> 
                <span>Profile</span>
              </Link>
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
            <Link to="/BrowseInfluencersPage" className="flex items-center p-3 text-gray-500 border-b" onClick={toggleMobileMenu}>
              <Home className="w-6 h-6 mr-3" />
              <span>Home</span>
            </Link>
            <Link to="/SearchInfluencersPage" className="flex items-center p-3 text-gray-500 border-b" onClick={toggleMobileMenu}>
              <Search className="w-6 h-6 mr-3" />
              <span>Search</span>
            </Link>
            <Link to="/Contracts" className="flex items-center p-3 text-gray-500 border-b" onClick={toggleMobileMenu}>
              <FileText className="w-6 h-6 mr-3" />
              <span>Contracts</span>
            </Link>
            <Link to="/ConversationList" className="flex items-center p-3 text-gray-500 border-b" onClick={toggleMobileMenu}>
              <MessageCircle className="w-6 h-6 mr-3" />
              <span>Message</span>
            </Link>
            <Link to="/MyProfilePage" className="flex items-center p-3 text-pink-500" onClick={toggleMobileMenu}>
              <User className="w-5 h-5 mr-1" />
              <span>Profile</span>
            </Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow p-4 md:container md:mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-normal mb-4 md:mb-8">Profile Management</h2>
        
        {/* Profile Options Section */}
        <div className="grid grid-cols-1 gap-4 max-w-2xl">
          
          {/* Update Profile Info Button */}
          <button
            onClick={() => navigate('/BrandUpdate')}
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

          {/* Dispute Management Button */}
          <button
            onClick={() => navigate('/DisputePage')}
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
      </main>
    </div>
  );
};

export default ProfilePage;