import { useState } from "react";
import React from "react";
import backendUrl from "../utils/backendUrl";

function MessageList({ messages, currentUser, conversationId, onDelete, onEdit, readMessages }) {
  const [openMenuId, setOpenMenuId] = useState(null); //to open the menu
  const [editingMessageId, setEditingMessageId] = useState(null);  //to open the editing box
  const [editedContent, setEditedContent] = useState(''); // this first contains the current content  // and then it will contain the new content

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} am`;
  };

  const handleDelete = async (messageId) => {
    try {
      const response = await backendUrl.delete(`/api/conversations/${conversationId}/messages/${messageId}/`);
      onDelete(messageId);
    } catch (error) {
      console.error("Error deleting message:", error.response?.data || error.message);
    }
  };

  const handleEdit = async (messageId, newContent) => {
    try {
      const response = await backendUrl.patch(
        `/api/conversations/${conversationId}/messages/${messageId}/`,
        { content: newContent }
      );
      onEdit(messageId, response.data); // response.data is the new updated message returned
      setEditingMessageId(null); // Exit editing mode
    } catch (error) {
      console.error("Error editing message:", error.response?.data || error.message);
    }
  };

  const handleEditClick = (messageId, content) => {
    setEditingMessageId(messageId);
    setEditedContent(content);
    setOpenMenuId(null); // Close menu when editing
  };

  return (
    <div className="space-y-4">
      {messages.map((message) => {
        const isCurrentUser = message.sender_id === currentUser.id;  //true for a message sent by the current user

        return (
          <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : ''}`}>
            <div className="max-w-xs relative group">
              {/* Menu Button */}
              {isCurrentUser && (
                <div className="absolute -top-2 -right-6">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === message.id ? null : message.id)}
                    className="text-sm text-gray-500 hover:text-red-500 cursor-pointer"
                  >
                    •••
                  </button>

                  {openMenuId === message.id && (
                    <div className="flex flex-col absolute z-10 right-0 mt-1 bg-white border rounded shadow-lg">
                      <button
                        onClick={() => handleEditClick(message.id, message.content)}
                        className="block px-4 py-2 text-sm text-blue-600 hover:bg-blue-100 w-full text-left cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-red-100 w-full text-left cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* either the Message or the editing input */}
              <div className="flex flex-col">
                <div
                  className={`px-4 pt-2 pb-1 rounded-2xl max-w-xs flex ${
                    isCurrentUser
                      ? 'bg-pink-400 text-white'
                      : 'bg-gray-300 text-black'
                  }`}
                >
                  {editingMessageId === message.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEdit(message.id, editedContent);
                      }}
                      className="w-full"
                    >
                      <input
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="text-white text-sm px-2 py-1 rounded w-full"
                        autoFocus
                      />
                      <div className="flex justify-end">
                        <button type="submit" className="text-xs text-green-800 mt-1 cursor-pointer">Save</button>
                      </div>
                    </form>
                  ) : ( <>
                        <div className="mb-2 mr-2">{message.content}</div>
                        <div className="flex items-end justify-end">
                          <div className="text-xs font-light text-white text-opacity-70">
                            {formatTime(message.created_at)}
                          </div>

                          {/*message.is_read = true means this message is send as a history*/}
                          { message.is_read && isCurrentUser ? (
                            <span className="text-sm ml-2">✓✓</span>
                          ) : (
                            isCurrentUser && (
                              <span className="text-sm ml-2">
                                {readMessages.has(message.id) ? '✓✓' : '✓'}
                              </span>
                            )
                          ) }

                        </div> 
                      </>
                    )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MessageList;
