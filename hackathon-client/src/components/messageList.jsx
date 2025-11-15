export default function MessageList({ messages = [] }) {  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex ${msg.isSent ? 'justify-start' : 'justify-end'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
              msg.isSent
                ? 'bg-blue-600 text-white'
                : 'bg-blue-100 border border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-semibold text-sm">học sinh ẩn danh</span>
              <span className="text-xs opacity-70">{msg.createdAt}</span>
            </div>
            <p className="text-sm break-all">{msg.content}</p>
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
