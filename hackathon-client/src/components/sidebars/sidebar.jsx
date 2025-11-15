// components/sidebars/Sidebar.jsx
import { MessageSquare, MessageCircle } from 'lucide-react';

export default function Sidebar({ isOpen, activeTab, onTabChange }) {
  const tabs = [
    { id: 'class', label: 'Câu hỏi trên lớp', icon: MessageSquare, emoji: 'book' },
    { id: 'offtopic', label: 'Câu hỏi ngoài lề', icon: MessageCircle, emoji: 'chat' },
  ];
  return (
    <div className={`${isOpen ? 'w-64' : 'w-0'} bg-gradient-to-b from-blue-500 to-blue-700 shadow-2xl transition-all duration-300 overflow-hidden`}>
      <div className="p-6">
        <nav className="space-y-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${isActive 
                    ? 'bg-white text-cyan-600 shadow-lg scale-105' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon size={20} />
                <span className={`flex-1 text-left transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}