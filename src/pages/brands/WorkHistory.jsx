import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star } from 'lucide-react';
import backendUrl from '../../utils/backendUrl';

const WorkHistoryPage = () => {
  const { influencerUserId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkHistory = async () => {
      try {
        setLoading(true);
        const response = await backendUrl.get(`/api/reviews/?influencer_user_id=${influencerUserId}`);
        setReviews(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching work history:', error.response?.message);
        setError('Failed to load work history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (influencerUserId) {
      fetchWorkHistory();
    }
  }, [influencerUserId]);

  const renderStars = (rating) => {
    if (!rating) return <span className="text-gray-400 text-sm">No rating</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating 
                ? 'fill-yellow-400 text-yellow-400' 
                : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4 bg-pink-50">
        <p className="text-gray-600 text-sm">Loading work history...</p>
        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-pink-50 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-lg w-full text-center">
          {error}
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-outfit">
      <header className="p-4 bg-white sticky top-0 z-20 flex items-center border-b border-pink-300">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center mr-2 cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg text-pink-600 font-medium flex-grow">Work History</h1>
      </header>

      <main className="flex-grow w-full px-4 py-6 bg-pink-50">
        <div className="mx-auto w-full max-w-md md:max-w-xl lg:max-w-2xl">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <p className="text-gray-500 text-lg mb-2">No work history found</p>
                <p className="text-gray-400 text-sm">This influencer hasn't completed any contracts yet or given any reviews yet.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Completed Work ({reviews.length} {reviews.length === 1 ? 'project' : 'projects'})
                </h2>
              </div>
              
              {reviews.map((review, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {review.contract_title}
                    </h3>
                    {renderStars(review.rating)}
                  </div>
                  
                  {review.review_text && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Client Review:</h4>
                      <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                        "{review.review_text}"
                      </p>
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                    {review.created_at && (
                      <span>Reviewed on {new Date(review.created_at).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default WorkHistoryPage;