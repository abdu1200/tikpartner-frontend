import { useState, useEffect } from 'react';
import backendUrl from '../utils/backendUrl';
import { Link } from 'react-router-dom';

function ConversationList() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    setCurrentUser(JSON.parse(localStorage.getItem('user')));
  }, []);
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await backendUrl.get('/api/conversations/');
        setConversations(response.data);
        setLoading(false);
      } catch (error) {
        console.log('Error fetching conversations:', error);
        console.log("error", error.response.data )
        setError('Failed to load conversations. Please try again later.');        
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, []);
  

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4 bg-pink-50">
        <p className="text-gray-600 text-sm">Loading conversations...</p>
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
    <div className="flex flex-col min-h-screen bg-pink-50 font-outfit">
      <main className="flex-grow w-full px-4 py-6">
        <div className="w-full mx-auto md:max-w-xl lg:max-w-2xlmd:bg-pink-50 lg:bg-pink-50 md:shadow-md lg:shadow-lg md:rounded-xl lg:rounded-xl md:p-6 lg:p-8 flex flex-col h-[calc(100vh-3rem)] ">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <div className="flex items-center">
              <h1 className="text-2xl font-medium">Messages</h1>
            </div>
            <button className="p-2 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="px-4 py-3">
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Search message" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-4 bg-pink-100 text-gray-700 rounded-full focus:outline-none"
              />
              <div className="absolute right-0 pr-4 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>
          </div>
          
          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No messages yet
              </div>
            ) : (
              conversations
                .filter(conversation => {       //this filters conversations first(takes filtered conversations), then does the mapping to render them on to the screen
                  const otherUser = conversation.participants.find(p => p.id !== currentUser?.id);
                  const usernameMatch = otherUser?.username?.toLowerCase().includes(searchTerm.toLowerCase());
                  return usernameMatch;
                })
                .map(conversation => {
                  const otherUser = conversation.participants.find(p => p.id !== currentUser?.id);
                  const lastMessage = conversation.latest_message.content;
                  const lastMessageIsRead = conversation.latest_message.is_read;
                  const lastMessageSenderId = conversation.latest_message.sender;
                  const isLastMessageFromOtherUser = lastMessageSenderId !== currentUser?.id;

                  const lastMessageCreatedAt = conversation.latest_message.created_at;
                  
                  return (
                    <Link
                      key={conversation.id}
                      to={`/conversations/${conversation.id}`}
                      className="block px-4 py-3 hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <div className="relative mr-4">
                          <img
                            src={otherUser.avatar_url}
                            alt={otherUser.username}
                            className="w-12 h-12 rounded-full"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h3 className="text-lg font-medium text-gray-900">
                              {otherUser.username}
                            </h3>
                            <span className="text-xs text-gray-400">
                              {new Date(lastMessageCreatedAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 truncate flex items-center">
                            {lastMessage}
                            {isLastMessageFromOtherUser && !lastMessageIsRead && (
                              <span className="ml-2 px-2 py-0.5 text-xs text-white bg-pink-500 rounded-full flex items-center justify-center">1</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ConversationList;