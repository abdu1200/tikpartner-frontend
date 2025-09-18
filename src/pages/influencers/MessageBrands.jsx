import { useState, useEffect, useMemo } from 'react';
import { User, Send, ArrowLeft, Search } from 'lucide-react';
import backendUrl from '../../utils/backendUrl';
import { useNavigate } from 'react-router-dom';

const MessageBrands = () => {
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isOpening, setIsOpening] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
      setCurrentUser(JSON.parse(localStorage.getItem('user')));
    }, []);


  const categoryMap = {
    1: "Entertainment",
    2: "Tech",
    3: "Fashion",
    4: "Health",
    5: "Food",
    6: "Education",
  };

  // Get unique categories from the currently existing brands
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(brands.map(brand => brand.category))];
    return uniqueCategories.sort();
  }, [brands]);



  // Filter brands based on search term and selected category
  const filteredBrands = useMemo(() => {
    let filtered = brands;
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(brand => 
        brand.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(brand => brand.category == selectedCategory);
    }
    
    return filtered;
  }, [brands, searchTerm, selectedCategory]);



  // Fetch brands
  const fetchBrands = async () => {
    setLoadingBrands(true);
    try {
      const response = await backendUrl.get('auth/brand-register/');
      setBrands(response.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
      alert('Failed to load brands. Please try again.');
    } finally {
      setLoadingBrands(false);
    }
  };


  const handleSendMessage = async (brand) => {
    setIsOpening(true);

    try {
      const response = await backendUrl.post("/api/conversations/", {
        participants: [currentUser.id, brand.user.id]
      });
      
      const conversationId = response.data.id;
      navigate(`/conversations/${conversationId}`);
    } catch (error) {
      console.error("Failed to create conversation:", error);
      alert("Could not create a conversation. Please try again.");

    } finally {
        setIsOpening(false);
    }
  };


  // Fetch brands when component mounts
  useState(() => {
    fetchBrands();
  }, []);


  return (
    <div className="flex flex-col min-h-screen bg-pink-50 font-outfit">
      {/* Header */}
      <header className="p-4 bg-white sticky top-0 z-20">
        <div className="container mx-auto">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/WelcomePage')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </header>

      {/* Brands List */}
      <main className="flex-grow p-4 md:container md:mx-auto">
        <h1 className="text-xl text-pink-500 mb-5">Message Brands</h1>
        
        {/* Search and Filter Section */}
        <div className="mb-6 space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search brands by company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors duration-200"
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-colors duration-200 bg-pink-50 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryMap[category] || category}
                </option>
              ))}
            </select>
            
            {/* Clear Filters Button */}
            {(searchTerm || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
                className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {loadingBrands ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBrands.map((brand, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-200">
                    {brand.user?.profile_picture ? (
                      <img
                        src={brand.user.profile_picture}
                        alt={brand.company_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800 text-lg">{brand.company_name}</h3>
                    <p className="text-gray-500 text-sm">{categoryMap[brand.category]} Company</p>
                  </div>
                  <p className="text-gray-500 text-sm">{brand.company_size} Employees</p>
                </div>
                
                <button
                  onClick={() => handleSendMessage(brand)}
                  className="w-full flex items-center justify-center py-2 px-4 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors duration-200 cursor-pointer"
                >
                   <Send className="w-4 h-4 mr-2"  /> 
                   Send message
                </button>
              </div>
            ))}
          </div>
        )}
        
        {!loadingBrands && filteredBrands.length === 0 && brands.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No brands found matching your filters
              {searchTerm && ` for "${searchTerm}"`}
              {selectedCategory && ` in ${categoryMap[selectedCategory] || selectedCategory}`}.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
              }}
              className="mt-2 text-pink-500 hover:text-pink-600 text-sm underline"
            >
              Clear all filters
            </button>
          </div>
        )}
        
        {!loadingBrands && brands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No brands available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MessageBrands;