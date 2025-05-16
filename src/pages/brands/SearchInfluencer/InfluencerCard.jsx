import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import tiktokIcon from '../../../assets/tiktok.png'



const InfluencerCard = ({ influencer }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();
  
    // Format follower count (e.g., 128000 -> 128k)
    const formatFollowerCount = (count) => {
      if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
      } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
      }
      return count.toString();
    };
  
    const categoryMap = {
      1: "entertainment",
      2: "tech",
      3: "fashion",
      4: "health",
      5: "food",
      6: "education",
    };  
  
    const handleCardClick = () => {
      navigate(`/influencer/${influencer.id}`);
    };

    const handleFavoriteClick = (e) => {
      e.stopPropagation(); // Prevent card click
      setIsFavorite(!isFavorite);
    };
  
    return (
      <div 
        className="rounded-lg overflow-hidden shadow-md mb-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="relative">
          <div className="aspect-square w-full overflow-hidden">
            <img 
              src={influencer.avatar_url || "/api/placeholder/400/400"} 
              alt={influencer.display_name}
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            className="absolute top-3 right-3 bg-white p-1 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
            onClick={handleFavoriteClick}
          >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
          </button>
        </div>
        <div className="p-3 bg-pink-50">
          <h3 className="text-sm md:text-md lg:text-lg font-normal truncate">{influencer.display_name}</h3>
          <div className="text-gray-600 text-xs sm:text-sm my-1 truncate">
            {categoryMap[influencer.category]}
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center">
              <img src={tiktokIcon} alt="TikTok" className="w-4 h-4 mr-1" />
              <span className="font-bold text-xs sm:text-sm">{formatFollowerCount(influencer.follower_count)}</span>
            </div>
            <div className="text-gray-600 text-xs">{influencer.gender}</div>
          </div>
        </div>
      </div>
    );
  };
  

  export default InfluencerCard;