import { useState, useEffect } from "react";
import { ChevronLeft, MoreVertical } from "lucide-react";
import backendUrl from "../../../../utils/backendUrl";
import OfferCard from "./AcceptedOfferCard";
import { useNavigate } from "react-router-dom";

const AcceptedOffersList = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchAcceptedOffers = async () => {
          try {
            const response = await backendUrl.get('/api/accepted_offers/');
            setOffers(response.data);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching accepted offers:', error.response?.data);
            setError('Failed to load accepted offers. Please try again later.');
            setLoading(false);
          }
        };
    
        fetchAcceptedOffers();
      }, []);
    

      
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-screen space-y-4 bg-pink-50">
          <p className="text-gray-600 text-sm">Loading accepted offers...</p>
          <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 flex justify-center font-outfit bg-pink-50 md:pb-50 lg:pb-40">
       <div className="w-full md:max-w-lg lg:max-w-xl md:my-10 md:shadow-lg md:rounded-lg md:overflow-hidden bg-pink-50">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-pink-100">
          <button onClick={() => navigate('/InfContracts')} className="flex items-center mr-2 cursor-pointer">
            <ChevronLeft size={20} />
          </button>
          <span className="text-base ml-1">Accepted Offers</span>
          
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {offers.length === 0 ? (
            <div className="bg-red-100 border border-red-400 text-red-700 m-5 px-4 py-3 rounded text-center">No offers available</div>
          ) : (
            offers.map((offer) => (
              <OfferCard 
                key={offer.id} 
                offer={offer} 
              />
            ))
          )}
        </div>
      </div>
     </div>
    );
  };
  
  export default AcceptedOffersList;