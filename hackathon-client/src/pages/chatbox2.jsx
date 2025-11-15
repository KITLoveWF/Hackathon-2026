// src/pages/Chatbox.jsx hoặc MainContent.jsx
import { useState, useEffect } from 'react';
import ChatGrid from '#components/ChatGrid';
import { useLocation } from "react-router-dom";
import axios from 'axios';

export default function MainContent({ activeTab, chatActive, userRole }) {
  const location = useLocation();
  const state = location.state || {};
  const [classMessages, setClassMessages] = useState([]);
  const [offTopicMessages, setOffTopicMessages] = useState([]);
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
        
        // Fetch chatboxes
        const inClassRes = await axios.get(
          `http://localhost:10000/hackathon/chatbox_in_class/${classroomId}`
        );
        const offTopicRes = await axios.get(
          `http://localhost:10000/hackathon/chatbox_off_topic/${classroomId}`
        );
        
        const chatBoxInClass = inClassRes.data.data;
        const chatBoxOffTopic = offTopicRes.data.data;
        
        // Store chatbox IDs for later use
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
      } catch (err) {
        console.error("ERROR fetching chatboxes:", err);
        setClassMessages([]);
        setOffTopicMessages([]);
      }
    };
    
    fetchAll();
  }, [state]);

  const handleSend = () => {
    if (!chatActive || !inputValue.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: userRole === 'TEACHER' ? 'Giáo viên' : 'học sinh ẩn danh',
      content: inputValue,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      upvoteCount: 0,
      upvotes: [], // Initialize empty upvotes array
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
  };

  const handleUpvoteChange = async (questionId, newUpvoteCount) => {
    // Update count immediately for UI responsiveness
    setMessages(prev =>
      prev.map(msg =>
        msg.id === questionId ? { ...msg, upvoteCount: newUpvoteCount } : msg
      )
    );

    // Refetch questions to get fresh upvotes array from server
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
        placeholder={chatActive ? "Nhập câu hỏi của bạn..." : "Phiên chat đã đóng — chờ giáo viên mở"}
        chatActive={chatActive}
      />
    </div>
  );
} 