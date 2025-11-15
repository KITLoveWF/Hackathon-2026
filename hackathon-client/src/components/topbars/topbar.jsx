import { Menu, X, ArrowBigLeft  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  return (
    // <div className="bg-linear-to-r from-blue-500 to-blue-700 text-white p-4 shadow-lg">
    <div className="backdrop-blur-sm text-blue-500 p-4 shadow-lg">

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-700 text-white rounded-lg transition"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold text-white">HACKATHON 2026</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/classroom')}
            className="p-2 hover:bg-blue-500 rounded-lg transition"
          >
            <ArrowBigLeft size={22} className='hover:text-white' />
          </button>
        </div>
      </div>
    </div>
  );
}
