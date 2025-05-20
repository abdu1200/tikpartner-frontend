import { useState } from 'react';

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  return (
    <div className="p-4 border-t border-gray-200">
      <form onSubmit={handleSubmit} className="flex items-center cursor-pointer">
        <button type="button" className="mr-3 text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2c-3.39-.29-6.52-1.92-9.05-4.45S3.37 7.57 3.08 4.18A2 2 0 0 1 5 2h3c.93 0 1.73.64 1.93 1.54l.49 2.17a2 2 0 0 1-.56 1.86l-1.27 1.27a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 1.86-.56l2.17.49A2 2 0 0 1 22 16.92z"/>
          </svg>
        </button>
        
        <button type="button" className="mr-3 text-gray-400 cursor-pointer">
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
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </button>
        
        <div className="flex-1 bg-pink-100 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Send message"
            className="w-full bg-transparent border-0 focus:ring-0 outline-none text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        
        <button 
          type="submit" 
          className="ml-3 p-2 text-white bg-pink-600 rounded-full cursor-pointer"
          disabled={!message.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
          <g transform="rotate(45 12 12)">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </g>
        </svg>

        </button>
      </form>
    </div>
  );
}

export default MessageInput;