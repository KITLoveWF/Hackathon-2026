// src/services/ragService.js
import axios from 'axios';
import authService from './authService';

const API_URL = 'https://citatory-kristen-noninferably.ngrok-free.dev'; 

const ragService = {
  // Upload a PDF file to the knowledge base
  async addPDF(file, chunkSize = 1000, overlap = 200) {
    const role = authService.getRole();
    if (!role || role !== 'TEACHER') {
      throw new Error('Chỉ giáo viên mới có thể tải lên tài liệu.');
    }

    if (!file || file.type !== 'application/pdf') {
      throw new Error('Vui lòng cung cấp file PDF hợp lệ.');
    }


    const formData = new FormData();
    formData.append('file', file);
    formData.append('chunk_size', chunkSize);
    formData.append('overlap', overlap);

    const response = await axios.post(`${API_URL}/add_pdf`, formData, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    });
    console.log('RAG Service Response:', response.data);
    return response.data; // { status, message, chunks_added, total_docs }

  },

  // Query the knowledge base with a question
  async query(question, topK = 3) {
    if (!question || typeof question !== 'string') {
      throw new Error('Vui lòng cung cấp câu hỏi hợp lệ.');
    }
    const response = await axios.post(`${API_URL}/query`, { question, top_k: topK });
    return response.data; 

  },

  // Get knowledge base statistics
  async getStats() {
    try {
      const response = await axios.get(`${API_URL}/stats`);
      return response.data; // { total_documents, collection_name }
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Lấy thống kê thất bại.');
    }
  },

  // Clear the knowledge base
  async clearDatabase() {
    const user = authService.getUser();
    if (!user || user.User?.role !== 'TEACHER') {
      throw new Error('Chỉ giáo viên mới có thể xóa cơ sở tri thức.');
    }

    try {
      const response = await axios.delete(`${API_URL}/clear`);
      return response.data; // { status, message }
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Xóa cơ sở tri thức thất bại.');
    }
  },

  // Check API health
  async checkHealth() {
    try {
      const response = await axios.get(`${API_URL}/health`);
      return response.data; // { status }
    } catch (error) {
      throw new Error(error.response?.datail || 'API không khả dụng.');
    }
  },
  clusterQuestions: async (questions, numClusters = 3) => {
    const response = await fetch(`${API_URL}/cluster_questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        questions, 
        num_clusters: numClusters 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Clustering failed');
    }

    return await response.json();
  },
    
};

export default ragService;