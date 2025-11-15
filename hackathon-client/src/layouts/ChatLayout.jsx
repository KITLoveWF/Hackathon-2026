import { useState, useEffect } from 'react';
import Topbar from '#components/topbars/Topbar';
import Sidebar from '#components/sidebars/Sidebar';
import MainContent from '#pages/Chatbox';
import authService from '../services/authService';

export default function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('class');
  const [chatActive, setChatActive] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = authService.getRole();
    setUserRole(role);

    if (role === 'TEACHER') {
      setChatActive(true);
    }
  }, []);

  const showSidebar = userRole === 'TEACHER';

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 z-10" />
      <div className="absolute inset-0 bg-[url('/hackathon.jpg')] bg-cover bg-center bg-no-repeat opacity-90" />

      <div className="relative z-20 flex flex-col h-full">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userRole={userRole} />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isOpen={sidebarOpen}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            chatActive={chatActive}
            onChatToggle={() => setChatActive(prev => !prev)}
            userRole={userRole}
          />

          <main className="flex-1 overflow-hidden bg-transparent">
            <MainContent
              activeTab={activeTab}
              chatActive={chatActive}
              userRole={userRole}
            />
          </main>
        </div>
      </div>
    </div>
  );
}