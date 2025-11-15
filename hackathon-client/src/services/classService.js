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
    getTotalQuestionsByClassroomWeek: async (classrooms) => {
        try {
            const totalQuestionsData = [];
            for (const classroom of classrooms) {
                const response = await axios.get(`${API_URL}/hackathon/classroom/${classroom.id}/total-questions/week`);
                totalQuestionsData.push(
                    { 
                      classId: classroom.id, 
                      className: classroom.className,
                      questions: response.data
                    });
            }
            return totalQuestionsData;
        } catch (error) {
            throw error;
        }
    },
    getTotalQuestionsByClassroomLastWeek: async (classrooms) => {
        try {
            const totalQuestionsData = [];
            for (const classroom of classrooms) {
                const response = await axios.get(`${API_URL}/hackathon/classroom/${classroom.id}/total-questions/last-week`);
                totalQuestionsData.push(
                    { 
                      classId: classroom.id, 
                      className: classroom.className,
                      questions: response.data
                    });
            }
            return totalQuestionsData;
        } catch (error) {
            throw error;
        }
    },
    getTotalQuestionsByClassroomMonth: async (classrooms) => {
        try {
            const totalQuestionsData = [];
            for (const classroom of classrooms) {
                const response = await axios.get(`${API_URL}/hackathon/classroom/${classroom.id}/total-questions/month`);
                totalQuestionsData.push(
                    { 
                      classId: classroom.id, 
                      className: classroom.className,
                      questions: response.data 
                    });
            }
            return totalQuestionsData;
        } catch (error) {
            throw error;
        }
    },
    getTotalQuestionsByClassroomLastMonth: async (classrooms) => {
        try {
            const totalQuestionsData = [];
            for (const classroom of classrooms) {
                const response = await axios.get(`${API_URL}/hackathon/classroom/${classroom.id}/total-questions/last-month`);
                totalQuestionsData.push(
                    { 
                      classId: classroom.id, 
                      className: classroom.className,
                      questions: response.data
                    });
            }
            return totalQuestionsData;
        } catch (error) {
            throw error;
        }
    },


};
export default classService;