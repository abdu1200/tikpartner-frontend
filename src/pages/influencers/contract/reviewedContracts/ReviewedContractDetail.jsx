import { useState, useEffect } from "react";
import { ChevronLeft, MoreVertical, Star } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import backendUrl from "../../../../utils/backendUrl";

const ContractDetailpage = () => {
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
  
    
    useEffect(() => {
        const fetchReviewedContractDetail = async () => {
          try {
            const response = await backendUrl.get(`/api/reviewed_contracts/${id}/`);
            setContract(response.data);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching reviewed contract details:', error.response?.data);
            setError('Failed to load review contract details. Please try again later.');
            setLoading(false);
          }
        };
    
        fetchReviewedContractDetail();
     }, [id]);    
    

    // Format date helper function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
    };
    

  
    if (loading) {
      return (
        <div className="flex flex-col justify-center items-center h-screen space-y-4 bg-pink-50">
          <p className="text-gray-600 text-sm">Loading a contract...</p>
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
  
    if (!contract) {
      return (
        <div className="h-full flex items-center justify-center bg-white bg-red-100 border border-red-400 px-4 py-3 rounded">
          <div>Contract not found</div>
        </div>
      );
    }
  
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center font-outfit bg-pink-50 md:pb-50 lg:pb-40">
       <div className="w-full md:max-w-lg lg:max-w-xl md:my-10 md:shadow-lg md:rounded-lg md:overflow-hidden bg-pink-50">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 bg-pink-100">
          <button 
           onClick={() => navigate('/InfReviewedContractsList')} 
           className="flex items-center mr-2 cursor-pointer"
           >
            <ChevronLeft size={20} />
          </button>
          <span className="text-base ml-1">View reviewed contract</span>
          <div className="ml-auto text-xs text-gray-400">
            Reviewed on: {formatDate(contract.review_created_at)}
          </div>
      
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="text-sm text-gray-500">Contract title</div>
            <div className="text-base mt-1">{contract.title}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500">Deliverable title</div>
            <div className="text-base mt-1">{contract.deliverable_title}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500">From brand:</div>
            <div className="flex items-center mt-2">
              <span className="text-base">{contract.brand_name}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500">Review Rating</div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`p-1 ${contract.review_rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                >
                  <Star size={24} fill={contract.review_rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500">Review text</div>
            <div className="text-base mt-1">{contract.review_review_text}</div>
          </div>
          
        </div>
        
        {/* Buttons */}
        <div className="p-4 mt-15">
          <button 
           onClick={() => navigate('/InfReviewedContractsList')} 
           className="w-full py-3 px-4 border border-gray-300 text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-200 rounded-md text-center font-medium mb-4 cursor-pointer"           > 
            Go back
          </button>
        </div>
      </div>
     </div>
    );
  };
  
  export default ContractDetailpage;