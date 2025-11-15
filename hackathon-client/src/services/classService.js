import axios from 'axios';

const API_URL = 'http://localhost:10000';
const classService = {
    getClassroomsByTeacherId: async (teacherId) => {
        try {
            const response = await axios.get(`${API_URL}/hackathon/classrooms/${teacherId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getClassroomsByStudentId: async (studentId) => {
        try {
            const response = await axios.get(`${API_URL}/hackathon/student/classrooms/${studentId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};
export default classService;