import { ChevronLeft, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";



const ContractCard = ({ contract }) => {
    const navigate = useNavigate();

    // Format date helper function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const handleCardClick = () => {
        navigate(`/ReviewedContract/${contract.id}`);
    };
    

    return (
      <div 
        className="border-b border-gray-200 py-4 px-4 cursor-pointer hover:bg-pink-100 transition-colors"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h3 className="text-base font-medium text-gray-900">{contract.title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              To influencer: {contract.influencer_name}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Work approved & fund released at: {formatDate(contract.deliverable_approved_at)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Reviewed on {formatDate(contract.review_created_at)}
            </p>
          </div>
          <ChevronLeft className="text-gray-400 rotate-180" size={20} />
        </div>
      </div>
    );
  };

  export default ContractCard;