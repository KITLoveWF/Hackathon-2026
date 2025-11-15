// src/pages/Chatbox.jsx hoặc MainContent.jsx
import { useState } from 'react';
import ChatGrid from '#components/ChatGrid';
import ragService from '../services/ragService';

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent backdrop-blur-sm bg-opacity-90 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">Câu trả lời tự động</h3>
        <p className="text-gray-700 mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default function MainContent({ activeTab, chatActive, userRole }) {
  const [classMessages, setClassMessages] = useState([
    { id: 1, user: 'Học sinh A', message: 'Em có thắc mắc về bài tập số 5 ạ', time: '10:30' },
    { id: 2, user: 'Giáo viên', message: 'Em hãy nêu cụ thể phần nào em chưa hiểu nhé', time: '10:32' }
  ]);

  const [offTopicMessages, setOffTopicMessages] = useState([
    { id: 1, user: 'Học sinh B', message: 'Thầy ơi, giờ ra chơi là mấy giờ ạ?', time: '10:25' },
    { id: 2, user: 'Học sinh C', message: 'Các bạn có đi ăn trưa không?', time: '10:28' }
  ]);

  const [classInput, setClassInput] = useState('');
  const [offTopicInput, setOffTopicInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [popup, setPopup] = useState({ visible: false, message: '' }); // State cho popup

  const isClass = activeTab === 'class';
  const messages = isClass ? classMessages : offTopicMessages;
  const inputValue = isClass ? classInput : offTopicInput;
  const setInputValue = isClass ? setClassInput : setOffTopicInput;
  const setMessages = isClass ? setClassMessages : setOffTopicMessages;

  const academicKeywords = [
    'môn học', 'điểm số', 'bài tập', 'kiểm tra', 'thi', 'giáo trình', 'học', 'lý thuyết',
    'thực hành', 'điểm', 'chương', 'bài', 'câu hỏi', 'giải thích', 'công thức'
  ];

  const isAcademicQuestion = (message) => {
    const lowerMessage = message.toLowerCase();
    return academicKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const handleSend = async () => {
    if (!chatActive || !inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: userRole === 'TEACHER' ? 'Giáo viên' : 'Bạn',
      message: inputValue,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isSent: true
    };

    // Thêm tin nhắn vào danh sách (trừ trường hợp là câu hỏi học thuật trong off-topic)
    if (isClass || !isAcademicQuestion(inputValue)) {
      setMessages(prev => [...prev, newMessage]);
    }

    setInputValue('');

    // Xử lý câu hỏi học thuật trong tab ngoài lề
    if (!isClass && isAcademicQuestion(inputValue)) {
      setIsLoading(true);
      setError('');
      try {
        const response = await ragService.query(inputValue, 3);
        // Hiển thị câu trả lời trong popup thay vì thêm vào danh sách tin nhắn
        setPopup({
          visible: true,
          message: response.answer || 'Không tìm thấy thông tin liên quan.'
        });
      } catch (err) {
        setError(err.message || 'Không thể lấy câu trả lời từ chatbot.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const closePopup = () => {
    setPopup({ visible: false, message: '' });
  };

  return (
    <div className="h-full p-4 md:p-8">
      {isLoading && (
        <div className="text-center text-gray-500">Đang xử lý câu hỏi...</div>
      )}
      {error && (
        <div className="text-center text-red-500 mb-4">{error}</div>
      )}
      <ChatGrid
        color={activeTab === 'class' ? 'green' : 'purple'}
        messages={messages}
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onSendMessage={handleSend}
        placeholder={chatActive ? "Nhập câu hỏi của bạn..." : "Phiên chat đã đóng — chờ giáo viên mở"}
        chatActive={chatActive}
      />
      {popup.visible && <Popup message={popup.message} onClose={closePopup} />}
    </div>
  );
}