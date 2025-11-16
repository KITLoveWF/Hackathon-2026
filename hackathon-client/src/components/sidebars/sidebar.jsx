import { useState } from 'react';
import { MessageSquare, MessageCircle, Upload, X, Power, PowerOff, BarChart } from 'lucide-react';
import ragService from '../../services/ragService';
import StatisticsModal from '../StatisticsModal';
export default function Sidebar({ isOpen, activeTab, onTabChange, chatActive, onChatToggle, userRole, chatboxId }) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);

  const tabs = [
    { id: 'class', label: 'Câu hỏi trên lớp', icon: MessageSquare },
    { id: 'offtopic', label: 'Câu hỏi ngoài lề', icon: MessageCircle },
    { id: 'upload', label: 'Tải tài liệu lên', icon: Upload },
    { id: 'statistics', label: 'Thống kê câu hỏi', icon: BarChart }, // Tab mới
  ];

  const handleUploadClick = () => {
    onTabChange('upload');
    setIsUploadModalOpen(true);
  };

  const handleStatisticsClick = () => {
    onTabChange('statistics');
    setIsStatisticsModalOpen(true);
  };

  return (
    <>
      <div
        className={` ${isOpen ? 'w-64' : 'w-0'} backdrop-blur-sm shadow-2xl transition-all duration-300 overflow-hidden flex flex-col `}
      >
        <div className="p-6 flex-1">
          <nav className="space-y-3">
            {(userRole === 'TEACHER' ? tabs : tabs.filter(t => t.id !== 'upload' && t.id !== 'statistics')).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={
                    tab.id === 'upload'
                      ? handleUploadClick
                      : tab.id === 'statistics'
                      ? handleStatisticsClick
                      : () => onTabChange(tab.id)
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-white text-cyan-600 shadow-lg scale-105'
                      : 'text-white/80 hover:bg-white/10 hover:text-white hover:scale-102'
                  }`}
                >
                  <Icon size={20} />
                  <span className={`flex-1 text-left transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {userRole === 'TEACHER' && activeTab ==='class' && (
          <div className="p-6 pt-0 border-t border-white/20">
            <button
              onClick={onChatToggle}
              className={`w-full flex items-center justify-center gap-4 px-6 py-4 rounded-xl font-bold text-white transition-all transform hover:scale-105 shadow-xl
                ${chatActive ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}
              `}
            >
              {!chatActive ? (
                <>
                  <PowerOff size={26} />
                  <span className={isOpen ? 'block' : 'hidden'}>Kết thúc phiên</span>
                </>
              ) : (
                <>
                  <Power size={26} />
                  <span className={isOpen ? 'block' : 'hidden'}>Bật phiên</span>
                </>
              )}
            </button>
            {isOpen && (
              <p className="text-white/80 text-sm text-center mt-3 font-medium">
                Trạng thái:{' '}
                <span className={chatActive ? 'text-red-300' : 'text-emerald-300'}>
                  {chatActive ? 'Đã tắt' : 'Đang hoạt động'}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
      <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} />
      <StatisticsModal isOpen={isStatisticsModalOpen} onClose={() => setIsStatisticsModalOpen(false)} chatboxId={chatboxId} />
    </>
  );
}

function UploadModal({ isOpen, onClose }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null); // Add state for error handling

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf') {
        setFile(droppedFile);
        setError(null); // Clear any previous errors
      } else {
        setError('Chỉ chấp nhận file PDF!');
      }
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setError(null); // Clear any previous errors
      } else {
        setError('Vui lòng chọn file PDF.');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null); // Clear any previous errors

    try {
      const response = await ragService.addPDF(file); 
      setUploading(false);
      setSuccess(true);

      // Show success message for 2 seconds, then reset
      setTimeout(() => {
        setFile(null);
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setUploading(false);
      setError(err.message || 'Tải lên thất bại. Vui lòng thử lại.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200"
        onDragEnter={handleDrag}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {success ? 'Tải lên thành công!' : 'Tải tài liệu PDF'}
        </h2>

        {!success && (
          <>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all
                ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                ${file ? 'border-green-500 bg-green-50' : ''}
              `}
            >
              {file ? (
                <div className="space-y-3">
                  <p className="text-lg font-medium text-green-700">{file.name}</p>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <>
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    Kéo thả file PDF vào đây hoặc
                  </p>
                  <label className="mt-4 inline-block">
                    <span className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
                      Chọn file từ máy
                    </span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </>
              )}
            </div>

            {error && (
              <p className="mt-4 text-red-600 text-center text-sm">{error}</p>
            )}

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`px-8 py-3 rounded-lg font-medium transition-all
                  ${file && !uploading
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                {uploading ? 'Đang tải lên...' : 'Tải lên ngay'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}