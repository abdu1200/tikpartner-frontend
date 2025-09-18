import { useState, useEffect } from 'react';
import { Home, Search, FileText, MessageCircle, User, Menu, X, Filter, ChevronDown, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import backendUrl from '../../../utils/backendUrl';
import aggreementIcon from '../../../assets/agreement.jpg';
import InfluencerCard from './InfluencerCard';
import MessageNotifications from '../../../components/MessageNotifications';
import { useNavigate } from 'react-router-dom';

const SearchInfluencersPage = () => {
  const [influencers, setInfluencers] = useState([]);
  const [filteredInfluencers, setFilteredInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  
  // Filter states - only keeping follower_count, gender, category, and budget
  const [filters, setFilters] = useState({
    followers: {
      from: '',
      to: ''
    },
    gender: '',
    category: '',
    budget: '',
  });

  const categoryMap = {
    Entertainment: 1,
    Tech: 2,
    Fashion: 3,
    Health: 4,
    Food: 5,
    Education: 6
  };
  
  // Available filter options - updated with proper capitalization
  const genderOptions = ['Male', 'Female'];
  const categoryOptions = ['Fashion', 'Tech', 'Entertainment', 'Food', 'Health', 'Education'];



  useEffect(() => {
    const fetchBrandProfile = async () => {
      try {
        const response = await backendUrl.get('/auth/brand-register/me/');
        setUserProfile(response.data);

      } catch (error) {
        console.error('Error fetching brand profile:', error.response?.data);
      }
    };
  
    fetchBrandProfile();
  }, []);



  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const response = await backendUrl.get('/auth/influencer-register/');
        setInfluencers(response.data);
        setFilteredInfluencers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching influencers:', error);
        setError('Failed to load influencers. Please try again later.');
        setLoading(false);
      }
    };

  

    fetchInfluencers();
  }, []);



  useEffect(() => {
    applyFilters();
  }, [searchQuery]);


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



  const handleLogOut = async () => {
    // Clear any existing tokens/data first
    localStorage.clear();
    navigate('/')
  };
  

  const applyFilters = () => {
    setHasSearched(true);
    
    let results = [...influencers];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(influencer =>
        influencer.display_name?.toLowerCase().includes(query)
      );
    }
    
    // Apply category filter - fixed to match API structure
    if (filters.category) {
      const categoryId = categoryMap[filters.category];
      results = results.filter(influencer => influencer.category === categoryId);
    }
    
    // Apply gender filter - fixed to be case-insensitive and handle null values
    if (filters.gender) {
      results = results.filter(influencer => 
        influencer.gender.toLowerCase() === filters.gender.toLowerCase()
      );
    }
    
    // Apply follower count filter - fixed to handle numeric comparisons properly
    if (filters.followers.from || filters.followers.to) {
      results = results.filter(influencer => {
        const followerCount = influencer.follower_count || 0;
        
        if (filters.followers.from && filters.followers.to) {
          return followerCount >= parseInt(filters.followers.from) && 
                 followerCount <= parseInt(filters.followers.to);
        } else if (filters.followers.from) {
          return followerCount >= parseInt(filters.followers.from);
        } else if (filters.followers.to) {
          return followerCount <= parseInt(filters.followers.to);
        }
        
        return true;
      });
    }
    
    // Apply budget filter 
    if (filters.budget) {
      results = results.filter(influencer => {
        if (!influencer.budget) return false;
    
        const parseBudgetValue = (val) => {
          if (!val) return 0;
          const cleaned = val.toLowerCase().replace('k', '').replace('+', '').trim();
          const multiplier = val.toLowerCase().includes('k') ? 1000 : 1;
          return parseFloat(cleaned) * multiplier;
        };
    
        // Parse selected filter range
        const [minStr, maxStr] = filters.budget.split('-');
        const selectedMin = parseBudgetValue(minStr);
        const selectedMax = filters.budget.includes('+') ? Infinity : parseBudgetValue(maxStr);
    
        // Parse influencer range
        const [infMinStr, infMaxStr] = influencer.budget.split('-');
        const infMin = parseBudgetValue(infMinStr);
        const infMax = infMaxStr ? parseBudgetValue(infMaxStr) : infMin;
    
        // ✅ Match only if influencer budget is fully within selected range
        return infMin >= selectedMin && infMax <= selectedMax;
      });
    }
    
    
    setFilteredInfluencers(results);
    setShowFilters(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (category, field, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: typeof prev[category] === 'object' 
        ? { ...prev[category], [field]: value }
        : value
    }));
  };

  const clearFilters = () => {
    setFilters({
      followers: {
        from: '',
        to: ''
      },
      gender: '',
      category: '',
      budget: '',
    });
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
                  <img src={aggreementIcon} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-lg lg:text-xl font-semibold text-gray-800">Filter influencers</h1>
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
              <Link to="/BrowseInfluencersPage" className="flex items-center text-gray-500">
                <Home className="w-5 h-5 mr-1" />
                <span>Home</span>
              </Link>
              <Link to="/SearchInfluencersPage" className="flex items-center text-pink-500">
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
              <a href="/MyProfilePage" className="flex items-center text-gray-500">
              {userProfile?.user?.profile_picture ? (
                <img
                  src={getImageDisplayUrl(userProfile.user.profile_picture)}
                  alt="Profile preview"
                  className="w-7 h-7 rounded-full object-cover border-2 border-gray-300 mr-1"
                /> ) : ( <User className="w-5 h-5 mr-1" /> )}
                <span>{userProfile?.user?.first_name}</span>
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
          <nav className="flex flex-col p-4 h-full">
            <div className="flex-1">
              <Link to="/BrowseInfluencersPage" className="flex items-center p-3 text-gray-500 border-b" onClick={toggleMobileMenu}>
                <Home className="w-6 h-6 mr-3" />
                <span>Home</span>
              </Link>
              <Link to="/SearchInfluencersPage" className="flex items-center p-3 text-pink-500 border-b" onClick={toggleMobileMenu}>
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
              <a href="/MyProfilePage" className="flex items-center p-3 text-gray-600 border-b" onClick={toggleMobileMenu}>
              {userProfile?.user?.profile_picture ? (
                <img
                  src={getImageDisplayUrl(userProfile.user.profile_picture)}
                  alt="Profile preview"
                  className="w-7 h-7 rounded-full object-cover border-2 border-gray-300 mr-3"
                /> ) : (<User className="w-6 h-6 mr-3" />)}
                <span>{userProfile?.user?.first_name}</span>
              </a>
            </div>

            <div className="mt-auto">
              <button
                onClick={handleLogOut}
                className="flex items-center p-3 text-gray-500 border-t cursor-pointer"
              >
                <LogOut className="w-6 h-6 mr-3" />
                <span>Log out</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      
      {/* Main Content */}
      <main className="flex-grow p-4 md:container md:mx-auto">
        {/* Search and Filter Section */}
        <div className="mb-6">
          {/* Search Bar */}
          <div className="flex items-center mb-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search influencers"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <button 
              onClick={toggleFilters}
              className="ml-2 p-2 bg-white rounded-full border border-gray-300 focus:outline-none cursor-pointer"
            >
              <Filter className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-pink-500 text-sm font-medium cursor-pointer"
                >
                  Clear all
                </button>
              </div>
              
              {/* Category */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Category</h4>
                <select
                  className="w-full p-2 text-pink-500 border border-gray-300 rounded cursor-pointer"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', null, e.target.value)}
                >
                  <option value="">All Categories</option>
                    {categoryOptions.map((category) => (
                  <option key={category} value={category}>{category}</option>
                  ))}
                </select>

              </div>
              
              {/* Gender */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Gender</h4>
                <select
                  className="w-full text-pink-500 p-2 border border-gray-300 rounded cursor-pointer"
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', null, e.target.value)}
                >
                  <option value="">All Genders</option>
                  {genderOptions.map((gender, index) => (
                    <option key={index} value={gender.toLowerCase()}>{gender}</option>
                  ))}
                </select>
              </div>
              
              {/* Follower Range */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Followers</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-1/2 p-2 text-pink-500 border border-gray-300 rounded cursor-pointer"
                    value={filters.followers.from}
                    onChange={(e) => handleFilterChange('followers', 'from', e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-1/2 text-pink-500 p-2 border border-gray-300 rounded cursor-pointer"
                    value={filters.followers.to}
                    onChange={(e) => handleFilterChange('followers', 'to', e.target.value)}
                  />
                </div>
              </div>
              
              {/* Budget Range */}
              <div className="mb-4">
                <h4 className="font-medium mb-2">Budget (USD)</h4>
                <select
                  className="w-full text-pink-500 p-2 border border-gray-300 rounded cursor-pointer"
                  value={filters.budget}
                  onChange={(e) => handleFilterChange('budget', null, e.target.value)}
                >
                  <option value="">All Budgets</option>
                  <option value="1k-5k">1k - 5k</option>
                  <option value="5k-10k">5k - 10k</option>
                  <option value="10k-20k">10k - 20k</option>
                  <option value="20k+">20k+</option>
                </select>
              </div>
              
              {/* Apply Filters Button */}
              <button 
                className="w-full bg-pink-500 text-white py-2 rounded-lg font-medium cursor-pointer "
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Area */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : filteredInfluencers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {filteredInfluencers.map(influencer => (
              <InfluencerCard key={influencer.id} influencer={influencer} />
            ))}
          </div>
        ) : hasSearched ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Search className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Search className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Search for influencers</h3>
            <p className="text-gray-500">Use the search bar and filters to find influencers</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchInfluencersPage;