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
    const [isDeleting, setIsDeleting] = useState(false);
  
    
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


    const handleDelete = async (review_id) => {

      const confirmCancel = window.confirm(
        'Are you sure you want to delete this review?'
      );
      
      if (!confirmCancel) return;

      setIsDeleting(true);
      setError(null)

      try {
        const response = await backendUrl.delete(`/api/reviews/${review_id}/`);
        console.log('Review deleted successfully:', response.data);
        
        alert("Review deleted successfully");
        navigate('/ReviewedContractsList');

      } catch (error) {
        console.error('Error deleting contract review:', error.response?.data || error.message);
        setError('Failed to delete contract review. Please try again later.');

      } finally {
        setIsDeleting(false);
      }
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
           onClick={() => navigate('/ReviewedContractsList')} 
           className="flex items-center mr-2 cursor-pointer"
           disabled={isDeleting}
           >
            <ChevronLeft size={20} />
          </button>
          <span className="text-base ml-1">View reviewed contract</span>
          {/* <div className="ml-auto text-xs text-gray-400">
            Review on: {formatDate(contract.review_created_at)}
          </div> */}
          
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
            <div className="text-sm text-gray-500">To influencer:</div>
            <div className="flex items-center mt-2">
              <span className="text-base">{contract.influencer_name}</span>
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
           onClick={() => navigate('/ReviewedContractsList')} 
           className="w-full py-3 px-4 border border-gray-300 text-gray-700 hover:bg-gray-300 transition duration-200 rounded-md text-center font-medium mb-4 cursor-pointer"
           disabled={isDeleting}
           > 
            Go back
          </button>
          
          <button onClick={() => handleDelete(contract.review_id)} className="w-full py-3 px-4 bg-pink-600 hover:bg-pink-700 transition duration-200 text-white rounded-md text-center font-medium cursor-pointer">
            {isDeleting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting contract review...
                  </div>
                ) : (
                  'Delete contract Review'
                )}
          </button>
        </div>
      </div>
     </div>
    );
  };
  
  export default ContractDetailpage;