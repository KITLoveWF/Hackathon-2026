// components/ChatInput.jsx
import { Send } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function ChatInput({
  value = '',
  onChange,
  onSend,
  placeholder = 'Nhập tin nhắn...',
  color = 'green',       // 'green' | 'purple'
  chatActive = false,    // whether the whole chat is enabled
}) {
  const inputRef = useRef(null);

  // Auto-focus input when chat becomes active
  useEffect(() => {
    if (chatActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatActive]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();           
      if (chatActive && value.trim()) {
        onSend();
      }
    }
  };

  const colorMap = {
    green: {
      input: 'bg-emerald-50 hover:bg-emerald-100 focus:ring-emerald-400 placeholder-emerald-300',
      button: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white',
    },
    purple: {
      input: 'bg-purple-50 hover:bg-purple-100 focus:ring-purple-400 placeholder-purple-300',
      button: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white',
    },
  };

  const colors = colorMap[color] || colorMap.green;

  const inputClasses = `
    flex-1 px-5 py-3 rounded-xl transition-all duration-200
    focus:outline-none focus:ring-2
    ${chatActive ? colors.input : 'bg-gray-100 text-gray-400 cursor-not-allowed select-none'}
  `;

  const buttonClasses = `
    p-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-md
    ${chatActive && value.trim()
      ? `${colors.button} shadow-lg hover:shadow-xl`
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
    }
  `;

  return (
    <div className="p-4 border-t border-gray-200">
      <div className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e)}
          onKeyDown={handleKeyDown}
          placeholder={chatActive ? placeholder : 'Phiên chat đã tắt — bật để gửi tin nhắn'}
          disabled={!chatActive}
          className={inputClasses}
        />

        <button
          onClick={onSend}
          disabled={!chatActive || !value.trim()}
          className={buttonClasses}
          aria-label="Gửi tin nhắn"
        >
          <Send size={22} />
        </button>
      </div>

      {/* Small hint when chat is disabled */}
      {!chatActive && (
        <p className="text-center text-xs text-gray-500 mt-3">
          Phiên chat đã tắt — bật ở thanh bên để gửi tin nhắn
        </p>
      )}
    </div>
  );
}