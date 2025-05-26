import { useState, useEffect } from "react";
import { ChevronLeft, MoreVertical, X, Star } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import backendUrl from "../../../../utils/backendUrl";

const ContractDetailPage = () => {
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewData, setReviewData] = useState({
        rating: 0,
        review_text: ''
    });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewError, setReviewError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
  
    
    useEffect(() => {
        const fetchReleasedContractDetail = async () => {
          try {
            const response = await backendUrl.get(`/api/released_contracts/${id}/`);
            setContract(response.data);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching contract details:', error.response?.data);
            setError('Failed to load contract details. Please try again later.');
            setLoading(false);
          }
        };
    
        fetchReleasedContractDetail();
     }, [id]);    
    

    // Format date helper function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
    };

    // Handle review submission
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        
        if (reviewData.rating === 0) {
            setReviewError('Please select a rating');
            return;
        }

        setSubmittingReview(true);
        setReviewError(null);

        try {
            const response = await backendUrl.post('/api/reviews/', {
                contract: contract.id,
                reviewee: contract.influencer_user_id,
                rating: reviewData.rating,
                review_text: reviewData.review_text
            });

            console.log("successful review submit", response.data)
            // Reset form and close modal
            setReviewData({ rating: 0, review_text: '' });
            setShowReviewModal(false);
            
            // Optionally show success message or redirect
            alert('Review submitted successfully!');
            
        } catch (error) {
            console.error('Error submitting review:', error.response?.data);
            setReviewError('Failed to submit review. Please try again.');
        } finally {
            setSubmittingReview(false);
        }
    };

    // Handle star rating click
    const handleStarClick = (rating) => {
        setReviewData(prev => ({ ...prev, rating }));
    };

    // Handle review text change
    const handleReviewTextChange = (e) => {
        setReviewData(prev => ({ ...prev, review_text: e.target.value }));
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
           onClick={() => navigate('/ReleasedContractsList')} 
           className="flex items-center mr-2 cursor-pointer"
           >
            <ChevronLeft size={20} />
          </button>
          <span className="text-base ml-1">View Released contract</span>
          <div className="ml-auto text-xs text-gray-400">
            Fund released at {formatDate(contract.deliverable_approved_at)}
          </div>
          
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="text-sm text-gray-500">Contract title</div>
            <div className="text-base mt-1">{contract.title}</div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500">To influencer:</div>
            <div className="flex items-center mt-2">
              <span className="text-base">{contract.influencer_name}</span>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500">Original Amount</div>
            <div className="text-base mt-1">$ {contract.payment_amount}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500">Released Amount</div>
            <div className="text-base mt-1">$ {contract.payment_transfer_amount}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500">Platform Fee</div>
            <div className="text-base mt-1">$ {contract.payment_platform_fee}</div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500">Deliverable title</div>
            <div className="text-base mt-1">{contract.deliverable_title}</div>
          </div>
          
          <div className="mb-6">
            <div className="text-sm text-gray-500">deliverable description</div>
            <div className="text-base mt-1">{contract.deliverable_description || "No description"} </div>
          </div>
          
        </div>
        
        {/* Buttons */}
        <div className="p-4">

          <button 
           onClick={() => navigate('/ReleasedContractsList')} 
           className="w-full py-3 px-4 border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition duration-200 rounded-md text-center font-medium mb-4 cursor-pointer"
           > 
            Go back
          </button>

          {contract.review_rating? 
            <div className="w-full py-3 px-4 text-pink-700 hover:bg-pink-100 transition duration-200 rounded-md text-center font-medium mb-4" >
              you have already reviewed this contract! 
            </div> : 
            <button
             className="w-full py-3 px-4 border border-gray-300 bg-pink-600 text-white hover:bg-pink-700 transition duration-200 rounded-md text-center font-medium mb-4 cursor-pointer"
             onClick={() => setShowReviewModal(true)}
             > 
              Give Review
            </button> 
          }
          
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed absolute inset-0 backdrop-blur-xs bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Give Review</h2>
              <button 
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewData({ rating: 0, review_text: '' });
                  setReviewError(null);
                }}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleReviewSubmit} className="p-4">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      className={`p-1 ${reviewData.rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                    >
                      <Star size={24} fill={reviewData.rating >= star ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Text (Optional)
                </label>
                <textarea
                  value={reviewData.review_text}
                  onChange={handleReviewTextChange}
                  rows={4}
                  placeholder="Share your experience with this influencer..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                />
              </div>

              {reviewError && (
                <div className="mb-4 text-red-600 text-sm">
                  {reviewError}
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewData({ rating: 0, review_text: '' });
                    setReviewError(null);
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200 cursor-pointer"
                  disabled={submittingReview}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 py-2 px-4 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
     </div>
    );
  };
  
  export default ContractDetailPage;