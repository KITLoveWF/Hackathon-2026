import { useState, useEffect } from 'react';
import { X, BarChart as BarChartIcon, Network } from 'lucide-react';
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
  const [clusteredData, setClusteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numClusters, setNumClusters] = useState(3);

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
        setError(null);
        try {
          // const questions = await ragService.getFrequentQuestions();
          // const knowledge = await ragService.getPopularKnowledge();
          
          // const finalQuestions = questions.length > 0 ? questions : sampleQuestions;
          // const finalKnowledge = knowledge.length > 0 ? knowledge : sampleKnowledge;
          const questionTexts = sampleQuestions.map(q => q.text);
          const clusterResult = await ragService.clusterQuestions(questionTexts, numClusters);
          setClusteredData(clusterResult.clusters || []);
          // setFrequentQuestions(finalQuestions);
          // setPopularKnowledge(finalKnowledge);

          // // Perform clustering on the questions
          // if (finalQuestions.length > 0) {
          //   const questionTexts = finalQuestions.map(q => q.text);
          //   const clusterResult = await ragService.clusterQuestions(questionTexts, numClusters);
          //   setClusteredData(clusterResult.clusters || []);
          // }
        } catch (err) {
          console.error('Error fetching statistics:', err);
          setFrequentQuestions(sampleQuestions);
          setPopularKnowledge(sampleKnowledge);
          setClusteredData([]);
        } finally {
          setLoading(false);
        }
      };
      fetchStatistics();
    }
  }, [isOpen, numClusters]);

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
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
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

  const clusterColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 overflow-y-auto"
      role="dialog"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full p-6 sm:p-8 relative transform transition-all duration-300 scale-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
          aria-label="Đóng modal"
        >
          <X size={24} />
        </button>

        {/* Modal Title */}
        <h2
          id="modal-title"
          className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2"
        >
          <BarChartIcon size={24} className="text-blue-600" />
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
          <div className="space-y-8">
            {/* Original Charts Row */}
            <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
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

            {/* Clustering Section */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Network size={20} className="text-purple-600" />
                  Phân cụm câu hỏi
                </h3>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Số cụm:</label>
                  <select
                    value={numClusters}
                    onChange={(e) => setNumClusters(Number(e.target.value))}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              {clusteredData.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clusteredData.map((cluster, index) => (
                    <div
                      key={cluster.cluster_id}
                      className="bg-gray-50 rounded-lg p-4 border-l-4 hover:shadow-md transition-shadow"
                      style={{ borderLeftColor: clusterColors[index % clusterColors.length] }}
                    >
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: clusterColors[index % clusterColors.length] }}
                        ></span>
                        Cụm {cluster.cluster_id + 1}: {cluster.label}
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-600 max-h-40 overflow-y-auto">
                        {cluster.questions.map((question, qIndex) => (
                          <li key={qIndex} className="flex items-start gap-2">
                            <span className="text-gray-400 mt-1">•</span>
                            <span className="flex-1">{question}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-xs text-gray-500 mt-2">
                        {cluster.questions.length} câu hỏi
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Chưa có dữ liệu phân cụm câu hỏi.
                </p>
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