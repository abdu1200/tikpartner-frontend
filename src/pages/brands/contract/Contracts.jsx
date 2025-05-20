import { useState } from 'react';
import { Bell, ChevronRight, ChevronLeft, FileText, Briefcase, CheckSquare, Archive } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';


const Contracts = () => {
    const [notification, setNotification] = useState(false);
    const navigate = useNavigate();
    
    const menuItems = [
      { path: '/RequestedOffersList', icon: <FileText size={20} />, label: 'Requested Offers' },
      { path: '/offers', icon: <FileText size={20} />, label: 'Accepted Offers' },
      { path: '/active-contracts', icon: <Briefcase size={20} />, label: 'Active contracts' },
      { path: '/approve-work', icon: <CheckSquare size={20} />, label: 'Approve work' },
      { path: '/ended-contracts', icon: <Archive size={20} />, label: 'Ended contract' },
    ];
  
    const handleBellClick = () => {
      setNotification(!notification);
    };
  
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center font-outfit bg-pink-50 md:pb-50 lg:pb-40">
       <div className="w-full md:max-w-lg lg:max-w-xl md:my-10 md:shadow-lg md:rounded-lg md:overflow-hidden bg-pink-50">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b mb-5 bg-pink-100">
          <div className="flex items-center space-x-2">
            <button onClick={() => navigate('/BrowseInfluencersPage')} className="flex items-center mr-2 cursor-pointer">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-lg font-medium">Contracts</h1>
          </div>
          <button 
            className="relative focus:outline-none"
            onClick={handleBellClick}
          >
            <Bell size={20} />
            {notification && (
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
  
        {/* Menu Items */}
        <div className="flex flex-col">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className="flex justify-between items-center p-4 border-b border-gray-200 w-full text-left hover:bg-pink-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
     </div>
    );
  };
  
export default Contracts;