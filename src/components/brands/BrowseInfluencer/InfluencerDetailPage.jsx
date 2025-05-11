import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import backendUrl from '../../../utils/backendUrl';
import tiktokIcon from '../../../assets/tiktok.png';

const InfluencerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchInfluencerDetail = async () => {
      try {
        const response = await backendUrl.get(`/auth/influencer-register/${id}/`);
        setInfluencer(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching influencer details:', error);
        setError('Failed to load influencer details. Please try again later.');
        setLoading(false);
      }
    };

    fetchInfluencerDetail();
  }, [id]);

  const formatCount = (count) => {
    if (count >= 1_000_000) return (count / 1_000_000).toFixed(1) + 'M';
    if (count >= 1_000) return (count / 1_000).toFixed(1) + 'K';
    return count;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-pink-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-pink-50 p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-lg w-full">
          {error || "Influencer not found"}
        </div>
      </div>
    );
  }

  const categoryMap = {
    1: "Entertainment",
    2: "Tech",
    3: "Fashion",
    4: "Health",
    5: "Food",
    6: "Education",
  };

  const languageMap = {
    1 : "english",
    2 : "amharic",
    3 : "oromiffa",
  };
  

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent card click
    setIsFavorite(!isFavorite); 
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-outfit">
      <header className="p-4 bg-white sticky top-0 z-20 flex items-center  border-b border-pink-300">
        <h1 className="text-lg text-pink-600 font-medium flex-grow">{influencer.display_name}</h1>
        <button  onClick={handleFavoriteClick}>
          <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
        </button>
      </header>

      <main className="flex-grow w-full px-4 py-6 lg:pt-0 lg:pb-6 md:bg-pink-50">
        <div className="mx-auto w-full max-w-md md:max-w-xl lg:max-w-2xl 
            md:bg-pink-50 md:shadow-md md:rounded-xl md:p-6
            lg:bg-pink-50 lg:shadow-lg lg:rounded-xl lg:px-8 
            flex flex-col gap-6  md:mt-20 ">

          {/* Left Section */}
          <div className=" flex flex-col gap-4">
            <div className="relative w-40 h-40 mx-auto md:w-55 md:h-55 lg:w-55 lg:h-55">
              <img 
                src={influencer.avatar_url || "/api/placeholder/1000/1000"} 
                alt={influencer.display_name}
                className="w-full h-full object-cover rounded-full border"
              />
            </div>

            <div className="lg:border-b pb-4">
              <p className="text-gray-600 mb-2 lg:text-lg">Tiktok account</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center border rounded-md p-2 bg-pink-100">
                  <img src={tiktokIcon} alt="TikTok" className="w-6 h-6 mr-2" />
                  <div>
                    <p className="font-bold">{formatCount(influencer.follower_count)}</p>
                    <p className="text-xs lg:text-sm text-gray-500">Followers</p>
                  </div>
                </div>
                <div className="flex items-center border rounded-md p-2 justify-center bg-pink-100">
                  <div className="text-center">
                    <p className="font-bold">{influencer.video_count}</p>
                    <p className="text-xs lg:text-sm text-gray-500">Videos</p>
                  </div>
                </div>
                <div className="flex items-center border rounded-md p-2 justify-center bg-pink-100">
                  <div className="text-center">
                    <p className="font-bold">{formatCount(influencer.likes_count)}</p>
                    <p className="text-xs lg:text-sm text-gray-500">Likes</p>
                  </div>
                </div>
              </div>
            </div>

            

            
          </div>

          {/* Right Section */}
          <div className="flex flex-col justify-between lg:mt-0 gap-4">

            <div className="flex flex-wrap gap-2 border-b pb-2">
              <p className="text-gray-600 lg:text-lg mr-2">Content Type:</p>
              <span className="px-3 py-1 bg-pink-100 text-gray-800 rounded-full text-sm lg:text-md">
                {categoryMap[influencer.category]}
              </span>
            </div>

            <div className="flex items-center border-b pb-2 mb-2 lg:mb-0">
              <p className="text-gray-600 lg:text-lg mr-2">Budget per post:</p>
              <span className="px-3 py-1 bg-pink-100 text-gray-800 rounded-full text-sm lg:text-md">
                {influencer.budget}
              </span>
            </div>

            <div className="flex items-center border-b pb-2">
              <p className="text-gray-600 lg:text-lg mb-2 mr-2">Languages:</p>
                {
                  influencer.languages.map(id => (
                    <span
                      key={id}
                      className="px-3 py-1 bg-pink-100 text-gray-800 rounded-full text-sm mr-2 lg:text-md"
                    >
                      {languageMap[id]}
                    </span>
                  ))
                }
            </div>
            <button 
              className="w-full py-2  mt-10 md:h-11 md:mt-12 lg:mt-10 border border-pink-600 text-pink-600 rounded-lg text-center font-medium hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/portfolio/${influencer.user?.username || influencer.id}`)}
            >
              Portfolio
            </button>

            <button 
              className="w-full py-2 md:h-11 border border-pink-600 text-pink-600 rounded-lg text-center font-medium hover:bg-gray-50 cursor-pointer"
              onClick={() => navigate(`/work-history/${influencer.user?.username || influencer.id}`)}
            >
              Work History
            </button>

            <div className="flex gap-2">
              <button className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 cursor-pointer">
                Hire
              </button>
              <button className="flex-1 border border-pink-600 text-pink-600 py-3 rounded-lg font-medium hover:bg-gray-50 cursor-pointer">
                Send message
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InfluencerDetailPage;
