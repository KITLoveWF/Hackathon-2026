import { Send } from 'lucide-react';

export default function ChatInput({ 
  value, 
  onChange, 
  onSend, 
  placeholder, 
  color = 'green' 
}) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSend();
    }
  };

  const colorClasses = {
    green: 'focus:ring-emerald-100 bg-blue-100 hover:bg-blue-200',
    purple: 'focus:ring-blue-100 bg-blue-100 hover:bg-blue-200'
  };

  return (
    <div className="p-3 border-t border-gray-200">
      <div className="flex space-x-2">
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className={`flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${colorClasses[color]}`}
        />
        <button
          onClick={onSend}
          className={`${colorClasses[color].split('focus:ring-')[1]} text-white px-4 py-2 rounded-lg transition`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

