import { useState, useEffect } from 'react';
import { X, BarChart as BarChartIcon } from 'lucide-react';
import ragService from '../services/ragService';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function StatisticsModal({ isOpen, onClose }) {
  const [frequentQuestions, setFrequentQuestions] = useState([]);
  const [popularKnowledge, setPopularKnowledge] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample data
  const sampleQuestions = [
    { text: 'Câu hỏi về bài toán tích phân', count: 15 },
    { text: 'Cách giải phương trình bậc hai', count: 10 },
    { text: 'Định nghĩa đạo hàm', count: 8 },
  ];

  const sampleKnowledge = [
    { topic: 'Tích phân', count: 20 },
    { topic: 'Đạo hàm', count: 18 },
    { topic: 'Phương trình bậc hai', count: 12 },
  ];

  useEffect(() => {
    if (isOpen) {
      const fetchStatistics = async () => {
        setLoading(true);
        try {
          const questions = await ragService.getFrequentQuestions();
          const knowledge = await ragService.getPopularKnowledge();
          setFrequentQuestions(questions.length > 0 ? questions : sampleQuestions);
          setPopularKnowledge(knowledge.length > 0 ? knowledge : sampleKnowledge);
        } catch (err) {
        //   setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại.');
          setFrequentQuestions(sampleQuestions);
          setPopularKnowledge(sampleKnowledge);
        } finally {
          setLoading(false);
        }
      };
      fetchStatistics();
    }
  }, [isOpen]);

  // Close modal with Esc key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const questionsChartData = {
    labels: frequentQuestions.map(q =>
    q.text.length > 10 ? q.text.slice(0, 10) + "..." : q.text
    ),
    datasets: [
      {
        label: 'Số lần hỏi',
        data: frequentQuestions.map((q) => q.count),
        backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const questionsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Câu hỏi thường gặp', font: { size: 14 } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Số lần' } },
      x: { title: { display: true, text: 'Câu hỏi' } },
    },
  };

  // Pie Chart Data (Popular Knowledge)
  const knowledgeChartData = {
    labels: popularKnowledge.map((k) => k.topic),
    datasets: [
      {
        label: 'Số lần hỏi',
        data: popularKnowledge.map((k) => k.count),
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
        borderColor: ['#047857', '#B45309', '#991B1B', '#1E3A8A'],
        borderWidth: 1,
      },
    ],
  };

  const knowledgeChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 12 } } },
      title: { display: true, text: 'Kiến thức hay bị hỏi', font: { size: 14 } },
    },
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6 sm:p-8 relative transform transition-all duration-300 scale-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Đóng modal"
        >
          <X size={24} />
        </button>

        {/* Modal Title */}
        <h2
          id="modal-title"
          className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2"
        >
          <BarChartIcon size={20} className="text-blue-600" />
          Thống kê câu hỏi
        </h2>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Đang tải...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {/* Charts and Data */}
        {!loading && !error && (
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
            {/* Frequent Questions - Bar Chart */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Câu hỏi thường gặp
              </h3>
              {frequentQuestions.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-56 bg-gray-50 p-4 rounded-lg shadow-sm flex justify-center">
                    <div className="w-full">
                      <Bar data={questionsChartData} options={questionsChartOptions} />
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 max-h-40 overflow-y-auto">
                    {frequentQuestions.map((question, index) => (
                      <li key={index} className="flex justify-between">
                        <span className="font-small truncate">{question.text}</span>
                        <span>({question.count} lần)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-center">Chưa có dữ liệu câu hỏi.</p>
              )}
            </div>

            {/* Popular Knowledge - Pie Chart */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                Kiến thức hay bị hỏi
              </h3>
              {popularKnowledge.length > 0 ? (
                <div className="space-y-4">
                  <div className="h-56 bg-gray-50 p-4 rounded-lg shadow-sm flex justify-center">
                    <div className="w-full">
                      <Pie data={knowledgeChartData} options={knowledgeChartOptions} />
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 max-h-40 overflow-y-auto">
                    {popularKnowledge.map((knowledge, index) => (
                      <li key={index} className="flex justify-between">
                        <span className="font-medium truncate">{knowledge.topic}</span>
                        <span>({knowledge.count} lần)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-gray-500 text-center">Chưa có dữ liệu kiến thức.</p>
              )}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}