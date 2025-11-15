// src/pages/Chatbox.jsx hoặc MainContent.jsx
import { useState, useEffect } from 'react';
import ChatGrid from '#components/ChatGrid';
import { useLocation } from "react-router-dom";
import axios from 'axios';

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
        console.log("IN CLASS:", chatBoxInClass);
        console.log("OFF TOPIC:", chatBoxOffTopic);
        const questionsInClass = await axios.get(
          "http://localhost:10000/hackathon/questions/" + chatBoxInClass.id
        );
        const questionsOffTopic = await axios.get(
          "http://localhost:10000/hackathon/questions/" + chatBoxOffTopic.id
        );
        console.log("QUESTIONS IN CLASS:", questionsInClass.data.data);
        console.log("QUESTIONS OFF TOPIC:", questionsOffTopic.data.data);
        setClassMessages(questionsInClass.data.data);
        setOffTopicMessages(questionsOffTopic.data.data);
      } catch (err) {
        console.error("ERROR:", err);
      }
    };
    fetchAll();
  },[]);

  // const addComment = async (chatboxId, message, type) => {
  //   try {}
  //   catch (err) {
  //     console.error("Error adding comment:", err);
  //   }
  // }

  const handleSend = () => {
    if (!chatActive || !inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: userRole === 'TEACHER' ? 'Giáo viên' : 'học sinh ẩn danh',
      content: inputValue,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
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