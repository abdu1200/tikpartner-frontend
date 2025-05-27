import { useState, useEffect } from 'react';
import { Home, Search, FileText, MessageCircle, User, Menu, X } from 'lucide-react';
import backendUrl from '../../../utils/backendUrl';
import { Link } from 'react-router-dom';
import agreementIcon from '../../../assets/agreement.jpg'
import InfluencerCard from './InfluencerCard';
import MessageNotifications from '../../../components/MessageNotifications';


const BrowseInfluencersPage = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const response = await backendUrl.get('/auth/influencer-register/');
        setInfluencers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching influencers:', error.response?.data);
        setError('Failed to load influencers. Please try again later.');
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

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
            
            {/* Desktop Navigation - Now in the header for lg */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/BrowseInfluencersPage" className="flex items-center text-pink-500">
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
              <Link to="/profile" className="flex items-center text-gray-500">
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
            <Link to="/BrowseInfluencersPage" className="flex items-center p-3 text-pink-500 border-b" onClick={toggleMobileMenu}>
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
            <Link to="/profile" className="flex items-center p-3 text-gray-500" onClick={toggleMobileMenu}>
              <User className="w-6 h-6 mr-3" />
              <span>Profile</span>
            </Link>
          </nav>
        </div>
      )}

      
      {/* Main Content */}
      <main className="flex-grow p-4 md:container md:mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-normal mb-4 md:mb-8">Explore influencers that align with your brand.</h2>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {influencers.map(influencer => (
              <InfluencerCard key={influencer.id} influencer={influencer} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowseInfluencersPage;