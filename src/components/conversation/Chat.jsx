import { useState, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import { useParams } from 'react-router-dom';
import backendUrl from '../../utils/backendUrl';

function Chat() {
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);   // this is used for scrolling behaviour  // used to scroll to the bottom of the chat on new message.
    const [currentUser, setCurrentUser] = useState(null);
    const { conversationId } = useParams();
    const [otherUserName, setOtherUserName] = useState('');
    const [otherUserAvatar, setOtherUserAvatar] = useState(null);
    const [readMessages, setReadMessages] = useState(new Set());  // a Set is like an array, but it only stores unique values (no duplicates).

    const token = localStorage.getItem('accessToken');

    // websocketURL
    const socketUrl = conversationId && token
        ? `ws://127.0.0.1:8000/ws/chat/${conversationId}/?token=${token}`
        : null;

    // making the websocket connection  // sendMessage is used to send data(message or read) to the connected websocket server  // lastMessage holds the most recent message received from the server.
    // readyState indicates the current websocket connection status (e.g., OPEN, CLOSED)    // protocols is a websocket subprotocols to match server expectations. b/c the server expects a subprotocol and then the client will also expect a subprotocol
    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(socketUrl, {
        shouldReconnect: (closevent) => true,
        reconnectAttempts: 10,
        reconnectInterval: 3000,
        protocols: ['authorization'], 
        onOpen: () => console.log('WebSocket connected'),
        onClose: () => console.log('WebSocket disconnected'),
        onError: (e) => console.error('WebSocket error:', e),
    });
        

    // fetch current converstaion
    useEffect(() => {
        const fetchConversation = async () => {
          try {
            const response = await backendUrl.get(`/api/conversations/${conversationId}/`);
            const data = response.data;
            const otherUser = data.participants.find(p => p.id !== currentUser?.id);
            setOtherUserName(otherUser.username);
            setOtherUserAvatar(otherUser.avatar_url);
        } catch (error) {
            console.error('Failed to fetch conversation:', error);
          }
        };
      
        if (conversationId && currentUser) {
          fetchConversation();
        }
      }, [conversationId, currentUser]);


    // Retrieves and parses the logged-in user's data when the component mounts.   // JSON.parse() converts or parses a JSON-formatted string into a JavaScript object.
    useEffect(() => {
        setCurrentUser(JSON.parse(localStorage.getItem('user')));
    }, []);

    // when messages change(new message arrives), react re-renders the component, then the useEffect code runs & it scrolls to the bottom of the page smoothly using the messagesEndRef
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // handles incoming messages
    useEffect(() => {
        if (lastMessage !== null && currentUser) {
            const data = JSON.parse(lastMessage.data);

            if (data.type === 'history') {
                setMessages(data.messages);
            } else if (data.type === 'message') {
                setMessages(prev => [...prev, {
                    id: data.message_id,
                    content: data.message,
                    sender_id: data.sender_id,
                    sender_name: data.sender_name,
                    created_at: data.created_at,
                    attachments: data.attachments
                }]);
            } else if (data.type === 'read') {
                if (data.reader_id !== currentUser.id) {
                    // this means the other user in the conversation has read your message
                    const newReadIds = new Set(messages.map(msg => msg.id));
                    setReadMessages(newReadIds); // here we are putting the ids/id of an already read messages or an already read message in the readMessages array
                }
            }
        }
    }, [lastMessage]);


    const handleSendMessage = (msg) => {
        if (readyState === ReadyState.OPEN) {
            sendMessage(JSON.stringify({
                type: 'message',
                message: msg,
                attachments: []
            }));

        } else {
            console.error('WebSocket is not connected');
        }
    };

    const markAsRead = () => {
        if (readyState === ReadyState.OPEN) {
            sendMessage(JSON.stringify({ type: 'read' }));
        }
    };

    useEffect(() => {
        if (messages.length > 0 && readyState === ReadyState.OPEN) {
            markAsRead();
        }
    }, [messages, readyState]);
    

    const handleDeleteMessage = (messageId) => {
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      };

    const handleEditMessage = (messageId, updatedMessage) => {
        setMessages(prev =>
            prev.map(msg => (msg.id === messageId ? { ...msg, ...updatedMessage } : msg))
        );
    };
      
      

    if (!currentUser) {
        return <div className="flex items-center justify-center h-screen">Loading user data...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-pink-50 font-outfit">
            <main className="flex-grow w-full px-4 py-6">
                <div className="
                w-full 
                mx-auto 
                md:max-w-xl lg:max-w-2xl
                md:bg-pink-50 lg:bg-pink-50 
                md:shadow-md lg:shadow-lg 
                md:rounded-xl lg:rounded-xl 
                md:p-6 lg:p-8 
                flex flex-col h-[calc(100vh-3rem)]
                ">
                
                <ChatHeader 
                    otherUserName={otherUserName}
                    otherUserAvatar={otherUserAvatar}
                />
                
                <div className="flex-1 overflow-y-auto p-4">
                    <MessageList messages={messages} currentUser={currentUser} conversationId={conversationId} onDelete={handleDeleteMessage} onEdit={handleEditMessage} readMessages={readMessages}/>
                    <div ref={messagesEndRef} />
                </div>
                
                <MessageInput onSendMessage={handleSendMessage} />
                </div>
            </main>
        </div>


    );
}

export default Chat;
