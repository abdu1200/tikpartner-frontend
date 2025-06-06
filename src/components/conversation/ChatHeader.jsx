import { useNavigate } from 'react-router-dom';

function ChatHeader({ otherUserName, otherUserAvatar }) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center p-4 border-b border-gray-200">
      <button 
        onClick={() => navigate(-1)} 
        className="mr-4 cursor-pointer"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="flex items-center">
        <div className="relative mr-3">
          <img 
            src={otherUserAvatar} 
            alt={otherUserName} 
            className="w-8 h-8 rounded-full" 
          />
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
        </div>
        <h1 className="text-lg font-medium">{otherUserName}</h1>
      </div>
      
      {/* <button className="ml-auto cursor-pointer">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="1" />
          <circle cx="12" cy="5" r="1" />
          <circle cx="12" cy="19" r="1" />
        </svg>
      </button> */}
    </div>
  );
}

export default ChatHeader;