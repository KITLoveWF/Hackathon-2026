// src/pages/Chatbox.jsx hoặc MainContent.jsx
import { useState, useEffect } from 'react';
import ChatGrid from '#components/ChatGrid';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import socketService from '../services/socketService';

export default function MainContent({ activeTab, chatActive, userRole }) {
  const location = useLocation();
  const state = location.state || {};
  const [classMessages, setClassMessages] = useState([]);
  const [offTopicMessages, setOffTopicMessages] = useState([]);
  const [chatBoxInClassId, setChatBoxInClassId] = useState(null);
  const [chatBoxOffTopicId, setChatBoxOffTopicId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState(false);
  const [classInput, setClassInput] = useState('');
  const [offTopicInput, setOffTopicInput] = useState('');
  const [chatboxIds, setChatboxIds] = useState({ inClass: null, offTopic: null });

  const isClass = activeTab === 'class';
  const messages = isClass ? classMessages : offTopicMessages;
  const inputValue = isClass ? classInput : offTopicInput;
  const setInputValue = isClass ? setClassInput : setOffTopicInput;
  const setMessages = isClass ? setClassMessages : setOffTopicMessages;

  useEffect(() => {
    console.log("Chatbox useEffect - State:", state);
    
    const classroomId = state?.classroomId;
    if (!classroomId) {
      console.warn("No classroom ID found in state");
      setClassMessages([]);
      setOffTopicMessages([]);
      return;
    }

    const fetchAll = async () => {
      try {
        console.log("Fetching for classroom:", classroomId);
        
        const inClassRes = await axios.get(
          `http://localhost:10000/hackathon/chatbox_in_class/${classroomId}`
        );
        const offTopicRes = await axios.get(
          `http://localhost:10000/hackathon/chatbox_off_topic/${classroomId}`
        );
        
        const chatBoxInClass = inClassRes.data.data;
        const chatBoxOffTopic = offTopicRes.data.data;
        
        setChatboxIds({
          inClass: chatBoxInClass?.id,
          offTopic: chatBoxOffTopic?.id,
        });
        
        console.log("IN CLASS CHATBOX:", chatBoxInClass);
        console.log("OFF TOPIC CHATBOX:", chatBoxOffTopic);

        if (!chatBoxInClass) {
          console.error("In-class chatbox not found");
          setClassMessages([]);
        } else {
          try {
            const questionsInClassRes = await axios.get(
              `http://localhost:10000/hackathon/questions/${chatBoxInClass.id}`
            );
            console.log("IN CLASS API RESPONSE:", questionsInClassRes.data);
            const inClassQuestions = questionsInClassRes.data.data || questionsInClassRes.data || [];
            setClassMessages(Array.isArray(inClassQuestions) ? inClassQuestions : []);
          } catch (err) {
            console.error("Error fetching in-class questions:", err);
            setClassMessages([]);
          }
        }

        if (!chatBoxOffTopic) {
          console.warn("Off-topic chatbox not found (might not exist)");
          setOffTopicMessages([]);
        } else {
          try {
            const questionsOffTopicRes = await axios.get(
              `http://localhost:10000/hackathon/questions/${chatBoxOffTopic.id}`
            );
            console.log("OFF TOPIC API RESPONSE:", questionsOffTopicRes.data);
            const offTopicQuestions = questionsOffTopicRes.data.data || questionsOffTopicRes.data || [];
            setOffTopicMessages(Array.isArray(offTopicQuestions) ? offTopicQuestions : []);
          } catch (err) {
            console.error("Error fetching off-topic questions:", err);
            setOffTopicMessages([]);
          }
        }
        
        setChatBoxInClassId(chatBoxInClass?.id);
        setChatBoxOffTopicId(chatBoxOffTopic?.id);
      } catch (err) {
        console.error("ERROR fetching chatboxes:", err);
        setClassMessages([]);
        setOffTopicMessages([]);
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
      upvoteCount: 0,
      upvotes: [], 
      createdAt: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
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

  const handleUpvoteChange = async (questionId, newUpvoteCount) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === questionId ? { ...msg, upvoteCount: newUpvoteCount } : msg
      )
    );

    try {
      const isClass = activeTab === 'class';
      const chatboxId = chatboxIds[isClass ? 'inClass' : 'offTopic'];
      
      if (!chatboxId) return;

      const response = await axios.get(
        `http://localhost:10000/hackathon/questions/${chatboxId}`
      );
      
      const updatedQuestions = response.data.data || response.data || [];
      
      if (Array.isArray(updatedQuestions)) {
        setMessages(updatedQuestions);
        console.log('Questions refreshed after upvote:', updatedQuestions);
      }
    } catch (err) {
      console.error('Error refetching questions after upvote:', err);
    }
  };

  return (
    <div className="h-full p-4 md:p-8">
      <ChatGrid
        color={activeTab === 'class' ? 'green' : 'purple'}
        messages={messages}
        inputValue={inputValue}
        onInputChange={(e) => setInputValue(e.target.value)}
        onSendMessage={handleSend}
        onUpvoteChange={handleUpvoteChange}
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