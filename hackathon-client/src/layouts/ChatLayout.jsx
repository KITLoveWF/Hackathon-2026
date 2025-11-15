// layouts/ChatLayout.jsx
import { useState } from 'react';
import Topbar from '#components/topbars/Topbar';
import Sidebar from '#components/sidebars/Sidebar';
import MainContent from '#pages/Chatbox'; 

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('class'); // 'class' | 'offtopic'

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-10" />
      <div className="absolute inset-0 bg-[url('/hackathon.jpg')] bg-cover bg-center bg-no-repeat opacity-90" />

      {/* Nội dung chính */}
      <div className="relative z-20 flex flex-col h-full">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            isOpen={sidebarOpen} 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <main className="flex-1 overflow-hidden bg-transparent">
            <MainContent activeTab={activeTab} />
          </main>
        </div>
      </div>
    </div>
  );
}