// src/pages/Chatbox.jsx hoặc MainContent.jsx
import { useState, useEffect } from 'react';
import ChatGrid from '#components/ChatGrid';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import socketService from '../services/socketService';

export default function MainContent({ activeTab, chatActive, userRole }) {
  const { state } = useLocation();
  const [classMessages, setClassMessages] = useState([
    { id: 1, user: 'Học sinh A', content: 'Em có thắc mắc về bài tập số 5 ạ', createdAt: '10:30' },
    { id: 2, user: 'Giáo viên', content: 'Em hãy nêu cụ thể phần nào em chưa hiểu nhé', createdAt: '10:32' }
  ]);

  const [offTopicMessages, setOffTopicMessages] = useState([
    { id: 1, user: 'Học sinh B', content: 'Thầy ơi, giờ ra chơi là mấy giờ ạ?', createdAt: '10:25' },
    { id: 2, user: 'Học sinh C', content: 'Các bạn có đi ăn trưa không?', createdAt: '10:28' }
  ]);
  const [chatBoxInClassId, setChatBoxInClassId] = useState(null);
  const [chatBoxOffTopicId, setChatBoxOffTopicId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);

  const [classInput, setClassInput] = useState('');
  const [offTopicInput, setOffTopicInput] = useState('');

  const isClass = activeTab === 'class';
  const messages = isClass ? classMessages : offTopicMessages;
  const inputValue = isClass ? classInput : offTopicInput;
  const setInputValue = isClass ? setClassInput : setOffTopicInput;
  const setMessages = isClass ? setClassMessages : setOffTopicMessages;

  useEffect(() => {
    console.log(state.classroomId);
    const fetchAll = async () => {
      try {
        const inClassRes = await axios.get(
          "http://localhost:10000/hackathon/chatbox_in_class/" + state.classroomId
        );
        const offTopicRes = await axios.get(
          "http://localhost:10000/hackathon/chatbox_off_topic/" + state.classroomId
        );
        const chatBoxInClass = inClassRes.data.data;
        const chatBoxOffTopic = offTopicRes.data.data;
        setChatBoxInClassId(inClassRes.data.data.id);
        setChatBoxOffTopicId(offTopicRes.data.data.id);
        const questionsInClass = await axios.get(
          "http://localhost:10000/hackathon/questions/" + chatBoxInClass.id
        );
        const questionsOffTopic = await axios.get(
          "http://localhost:10000/hackathon/questions/" + chatBoxOffTopic.id
        );
        setClassMessages(questionsInClass.data.data);
        setOffTopicMessages(questionsOffTopic.data.data);
      } catch (err) {
        console.error("ERROR:", err);
      }
    };
    fetchAll();
  },[state.classroomId]);

  // WebSocket: Kết nối và tham gia room
  useEffect(() => {
    // Kết nối WebSocket
    socketService.connect();

    // Tham gia room khi có chatBoxId
    if (chatBoxInClassId && state.classroomId) {
      socketService.joinClassroom(state.classroomId, chatBoxInClassId, 'in_class');
    }
    if (chatBoxOffTopicId && state.classroomId) {
      socketService.joinClassroom(state.classroomId, chatBoxOffTopicId, 'off_topic');
    }

    // Lắng nghe tin nhắn mới
    socketService.onMessageReceived((message) => {
      console.log('📨 Received new message:', message);
      
      //Thêm message vào đúng tab
      if (message.type === 'in_class') {
        setClassMessages(prev => [...prev, message]);
      } else if (message.type === 'off_topic') {
        setOffTopicMessages(prev => [...prev, message]);
      }
    });

    // Cleanup khi unmount
    return () => {
      if (state.classroomId) {
        socketService.leaveClassroom(state.classroomId, 'in_class');
        socketService.leaveClassroom(state.classroomId, 'off_topic');
      }
      socketService.off('messageReceived');
      socketService.disconnect();
    };
  }, [chatBoxInClassId, chatBoxOffTopicId, state.classroomId]);

  useEffect(() => {
    console.log("UPDATED - in class:", chatBoxInClassId);
    console.log("UPDATED - off topic:", chatBoxOffTopicId);
  }, [chatBoxInClassId, chatBoxOffTopicId]);

  const addComment = async (content) => {
    try {
      let type = "off_topic";
      let chatboxId = chatBoxOffTopicId;
      if(activeTab === 'class') {
        type = "in_class";
        chatboxId = chatBoxInClassId;
      }
      const response = await axios.post(
        "http://localhost:10000/hackathon/send-message",
        {
          chatBoxId: chatboxId,
          context: content,
          type: type
        }
      );
      return response.data.status;
    }
    catch (err) {
      console.error("Error adding comment:", err);
    }
  }

  const handleSend = async () => {
    if (!chatActive || !inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: userRole === 'TEACHER' ? 'Giáo viên' : 'học sinh ẩn danh',
      content: inputValue,
      createdAt: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      })
    };
    setIsLoading(true)
    const status = await addComment(inputValue);
    setIsLoading(false)
    console.log(status);
    if (status === "success") {
      // setMessages(prev => [...prev, newMessage]);
    }
    else{
      setErrorPopup(true);
    }
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
        placeholder={chatActive&&JSON.parse(localStorage.getItem('user')).role === 'STUDENT' ? "Nhập câu hỏi của bạn..." : "Phiên chat đã đóng — chờ giáo viên mở"}
        chatActive={chatActive&& JSON.parse(localStorage.getItem('user')).role === 'STUDENT'}
      />
    {isLoading && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white px-6 py-4 rounded-lg shadow-lg text-center">
          <div className="loader mb-3"></div>
          <p className="text-gray-700 font-medium">Đang gửi câu hỏi...</p>
        </div>
      </div>
    )}
    {/* =================== ERROR POPUP =================== */}
    {errorPopup && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white p-5 rounded-xl shadow-lg w-80 text-center border-2 border-red-500">
          <div className="text-red-600 text-4xl mb-2">🚫</div>
          <h2 className="text-lg font-semibold text-red-600 mb-2">
            Không thể gửi câu hỏi!
          </h2>
          <p className="text-gray-700 mb-4">
            Bạn chỉ có thể đặt các câu hỏi nghiêm túc.
          </p>
          <button
            onClick={() => setErrorPopup(false)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Đóng
          </button>
        </div>
      </div>
    )}
    </div>
  );
}