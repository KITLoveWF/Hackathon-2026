import { useState, useEffect } from 'react';
import upvoteService from '../services/upvoteService';
import authService from '../services/authService';
import '../styles/messageList.css';

export default function MessageList({ messages = [], onUpvoteChange = null }) {
  const [upvotedQuestions, setUpvotedQuestions] = useState({});
  const [loading, setLoading] = useState({});
  const [floatingHearts, setFloatingHearts] = useState({});
  const user = authService.getUser();

  // Check which questions the current user has upvoted
  useEffect(() => {
    if (!user || !messages.length) return;

    const checkUserUpvotes = () => {
      const upvotedMap = {};
      messages.forEach(msg => {
        if (msg.upvotes && Array.isArray(msg.upvotes)) {
          const userUpvoted = msg.upvotes.some(upvote => upvote.userId === user.id);
          upvotedMap[msg.id] = userUpvoted; 
        } else {
          upvotedMap[msg.id] = false; y
        }
      });
      setUpvotedQuestions(upvotedMap);
    };

    checkUserUpvotes();
  }, [user, messages]);

  const handleUpvote = async (e, msg) => {
    e.stopPropagation();
    if (!msg.id || !user || loading[msg.id]) return; 

    const hasUpvoted = upvotedQuestions[msg.id];
    console.log(`[Upvote] Message ID: ${msg.id}, Current state: ${hasUpvoted}`);
    setLoading(prev => ({ ...prev, [msg.id]: true }));

    try {
      if (hasUpvoted) {
        console.log(`[Upvote] Attempting to remove upvote for message ${msg.id}`);
        const removeResponse = await upvoteService.removeUpvote(msg.id, user.id);
        console.log(`[Upvote] Remove response:`, removeResponse);
        
        setUpvotedQuestions(prev => {
          const newState = { ...prev };
          newState[msg.id] = false;
          console.log(`[Upvote] Updated state after remove:`, newState);
          return newState;
        });
        
        if (onUpvoteChange) {
          const newCount = Math.max(0, (msg.upvoteCount || 0) - 1);
          onUpvoteChange(msg.id, newCount);
        }
      } else {
        console.log(`[Upvote] Attempting to add upvote for message ${msg.id}`);
        const addResponse = await upvoteService.upvoteQuestion(msg.id);
        console.log(`[Upvote] Add response:`, addResponse);

        const currentCount = msg.upvoteCount || 0;
        const newCount = currentCount + 1;
        
        // Update state immediately
        setUpvotedQuestions(prev => {
          const newState = { ...prev, [msg.id]: true };
          console.log(`[Upvote] Updated state after add:`, newState);
          return newState;
        });
        
        // Thêm hiệu ứng tim bay
        for (let i = 0; i < newCount; i++) {
          setTimeout(() => {
            const heartId = `${msg.id}-${Date.now()}-${i}`;
            setFloatingHearts(prev => ({ ...prev, [heartId]: true }));
            setTimeout(() => {
              setFloatingHearts(prev => {
                const newState = { ...prev };
                delete newState[heartId];
                return newState;
              });
            }, 1000);
          }, i * 100); 
        }
        
        if (onUpvoteChange) {
          onUpvoteChange(msg.id, newCount);
        }
      }
    } catch (error) {
      console.error('[Upvote] Error:', error);
      console.error('[Upvote] Error message:', error.response?.data?.message || error.message);
      
      setUpvotedQuestions(prev => {
        const newState = { ...prev };
        newState[msg.id] = hasUpvoted; 
        return newState;
      });
      
      alert(error.response?.data?.message || 'Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(prev => ({ ...prev, [msg.id]: false }));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
      {Object.keys(floatingHearts).map(heartId => (
        <div key={heartId} className="floating-heart">
          ❤️
        </div>
      ))}

      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.isSent ? 'justify-start' : 'justify-end'} message-item`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-md cursor-pointer transition-all duration-200 hover:shadow-lg ${
              msg.isSent
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-blue-500/40'
                : 'bg-gradient-to-br from-slate-100 to-slate-50 text-slate-900 border border-slate-200 hover:shadow-slate-400/30'
            }`}
            onDoubleClick={(e) => handleUpvote(e, msg)}
            title="Double click to upvote"
          >
            <div className="flex justify-between items-start mb-2 gap-2">
              <span className="font-semibold text-sm">Học sinh ẩn danh</span>
             <span className="text-xs opacity-70">{new Date(msg.createdAt).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
              })}</span>
            </div>
            <p className="text-sm break-all leading-relaxed">{msg.content}</p>

            <div className="mt-3 flex items-center gap-2 min-h-10">
              {(msg.upvoteCount || 0) > 0 && (
                <button
                  onClick={(e) => handleUpvote(e, msg)}
                  disabled={loading[msg.id]}
                  title={upvotedQuestions[msg.id] ? 'Bỏ tim' : 'Tim'}
                  className={`upvote-button flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 bg-gradient-to-r from-red-400 via-red-500 to-pink-500 text-white shadow-lg shadow-red-300/50 hover:shadow-red-400/60 ${loading[msg.id] ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <svg
                    className={`w-4 h-4 transition-all duration-200 ${
                      upvotedQuestions[msg.id] ? 'scale-125 animate-pulse' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill={upvotedQuestions[msg.id] ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={upvotedQuestions[msg.id] ? '0' : '2'}
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span className="font-bold">{msg.upvoteCount || 0}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {messages.length === 0 && (
        <div className="text-center text-gray-400 text-sm mt-8">
          No messages yet. Start the conversation!
        </div>
      )}
    </div>
  );
}

