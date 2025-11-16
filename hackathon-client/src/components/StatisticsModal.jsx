import { useState, useEffect } from 'react';
import { X, Network, PieChart } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

// Sample data constants
const SAMPLE_QUESTIONS = [
  'Câu hỏi về bài toán tích phân',
  'Cách giải phương trình bậc hai',
  'Định nghĩa đạo hàm',
  'Công thức lượng giác cơ bản',
  'Phương pháp giải hệ phương trình',
  'Bài toán về giới hạn',
  'Ứng dụng đạo hàm trong thực tế',
  'Tính diện tích hình phẳng',
];

// Mock services for demo
const ragService = {
  clusterQuestions: async (questions, numClusters) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const clusters = [];
    const questionsPerCluster = Math.ceil(questions.length / numClusters);
    
    for (let i = 0; i < numClusters; i++) {
      const start = i * questionsPerCluster;
      const end = Math.min(start + questionsPerCluster, questions.length);
      const clusterQuestions = questions.slice(start, end);
      
      if (clusterQuestions.length > 0) {
        clusters.push({
          cluster_id: i,
          label: `Chủ đề ${i + 1}`,
          questions: clusterQuestions
        });
      }
    }
    
    return { clusters };
  }
};

const upvoteService = {
  getQuestionsSorted: async (chatboxId) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return SAMPLE_QUESTIONS.map(q => ({ text: q }));
  }
};

export default function StatisticsModal({ isOpen = true, onClose = () => {}, chatboxId = '123' }) {
  const [clusteredData, setClusteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [numClusters, setNumClusters] = useState(3);

  useEffect(() => {
    if (isOpen && chatboxId) {
      const fetchStatistics = async () => {
        setLoading(true);
        setError(null);
        try {
          const questions = await upvoteService.getQuestionsSorted(chatboxId);
          const questionTexts = questions.length > 0 
            ? questions.map(q => q.text || q.title || q.content)
            : SAMPLE_QUESTIONS;
          
          if (questionTexts.length > 0) {
            const clusterResult = await ragService.clusterQuestions(questionTexts, numClusters);
            setClusteredData(clusterResult.clusters || []);
          } else {
            setClusteredData([]);
          }
        } catch (err) {
          console.error('Error fetching statistics:', err);
          setError('Lỗi khi tải dữ liệu');
          setClusteredData([]);
        } finally {
          setLoading(false);
        }
      };
      fetchStatistics();
    }
  }, [isOpen, chatboxId, numClusters]);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const clusterColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899',
    '#14B8A6', '#F97316', '#06B6D4', '#84CC16'
  ];

  const totalQuestions = clusteredData.reduce((sum, cluster) => sum + cluster.questions.length, 0);

  // Prepare data for Chart.js
  const chartData = {
    labels: clusteredData.map(cluster => cluster.label),
    datasets: [
      {
        data: clusteredData.map(cluster => cluster.questions.length),
        backgroundColor: clusteredData.map((_, index) => clusterColors[index % clusterColors.length]),
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / totalQuestions) * 100).toFixed(1);
                return {
                  text: `${label}: ${value} câu hỏi (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = ((value / totalQuestions) * 100).toFixed(1);
            return `${label}: ${value} câu hỏi (${percentage}%)`;
          }
        }
      }
    }
  };

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
          <Network size={24} className="text-purple-600" />
          Phân cụm câu hỏi
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
            {/* Number of Clusters Selector */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Số cụm:</label>
                <select
                  value={numClusters}
                  onChange={(e) => setNumClusters(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Tổng: <span className="font-semibold text-gray-900">{totalQuestions}</span> câu hỏi
              </div>
            </div>

            {clusteredData.length > 0 ? (
              <>
                {/* Pie Chart Section */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <PieChart size={20} className="text-purple-600" />
                    Phân bố câu hỏi theo cụm
                  </h3>
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Pie Chart */}
                    <div className="w-full lg:w-1/2 h-80">
                      <Pie data={chartData} options={chartOptions} />
                    </div>

                    {/* Statistics Cards */}
                    <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                      {clusteredData.map((cluster, index) => (
                        <div
                          key={cluster.cluster_id}
                          className="bg-white rounded-lg p-4 shadow-sm border-l-4 hover:shadow-md transition-shadow"
                          style={{ borderLeftColor: clusterColors[index % clusterColors.length] }}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: clusterColors[index % clusterColors.length] }}
                            ></span>
                            <h4 className="font-semibold text-gray-800 text-sm">
                              {cluster.label}
                            </h4>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">
                            {cluster.questions.length}
                          </p>
                          <p className="text-xs text-gray-500">
                            {((cluster.questions.length / totalQuestions) * 100).toFixed(1)}% tổng số
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clustering Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Network size={20} className="text-purple-600" />
                    Chi tiết các cụm câu hỏi
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clusteredData.map((cluster, index) => (
                      <div
                        key={cluster.cluster_id}
                        className="bg-gray-50 rounded-lg p-4 border-l-4 hover:shadow-md transition-shadow"
                        style={{ borderLeftColor: clusterColors[index % clusterColors.length] }}
                      >
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: clusterColors[index % clusterColors.length] }}
                          ></span>
                          Cụm {cluster.cluster_id + 1}: {cluster.label}
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600 max-h-40 overflow-y-auto">
                          {cluster.questions.map((question, qIndex) => (
                            <li key={qIndex} className="flex items-start gap-2">
                              <span className="text-gray-400 mt-1 flex-shrink-0">•</span>
                              <span className="flex-1">{question}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                          {cluster.questions.length} câu hỏi ({((cluster.questions.length / totalQuestions) * 100).toFixed(1)}%)
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Chưa có dữ liệu phân cụm câu hỏi.
              </p>
            )}
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