// src/pages/Chatbox.jsx hoặc MainContent.jsx
import { useState } from 'react';
import ChatGrid from '#components/ChatGrid';

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

  const isClass = activeTab === 'class';
  const messages = isClass ? classMessages : offTopicMessages;
  const inputValue = isClass ? classInput : offTopicInput;
  const setInputValue = isClass ? setClassInput : setOffTopicInput;
  const setMessages = isClass ? setClassMessages : setOffTopicMessages;

  const handleSend = () => {
    if (!chatActive || !inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: userRole === 'TEACHER' ? 'Giáo viên' : 'Bạn',
      message: inputValue,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  return (
    <div className="h-full p-4 md:p-8">
      <ChatGrid
        color={activeTab === 'class' ? 'green' : 'purple'}
        messages={messages}
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onSendMessage={handleSend}
        placeholder={chatActive ? "Nhập câu hỏi của bạn..." : "Phiên chat đã đóng — chờ giáo viên mở"}
        chatActive={chatActive}
      />
    </div>
  );
}