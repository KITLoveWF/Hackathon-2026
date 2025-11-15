import { useEffect, useState } from "react";
import classService from "../services/classService";
import {useNavigate} from 'react-router-dom'
export default function Classroom() {
    const navigate = useNavigate()
    const [classrooms, setClassrooms] = useState([]);
    const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [timePeriod, setTimePeriod] = useState('week'); // 'week' or 'month'

    const role = JSON.parse(localStorage.getItem('user')).role;
    const [engagementData, setEngagementData] = useState({
        week: [],
        month: []
    });
    const calculateEngagement = (currentData, previousData) => {
    // currentData = [{ classId: 1, className: "Web Dev", questions: 156 }, ...]
    // previousData = [{ classId: 1, questions: 135 }, ...]
    
    const allQuestions = currentData.map(c => c.questions);
    const avgQuestions = allQuestions.reduce((a, b) => a + b, 0) / allQuestions.length;
    
    return currentData.map(current => {
        const previous = previousData.find(p => p.classId === current.classId);
        const prevQuestions = previous?.questions || 0;
        
        // Tính % thay đổi
        let changePercent = 0;
        if (prevQuestions > 0) {
            changePercent = ((current.questions - prevQuestions) / prevQuestions * 100).toFixed(0);
        }
        const change = changePercent >= 0 ? `+${changePercent}%` : `${changePercent}%`;
        
        // Xác định trend dựa trên so sánh với trung bình
        let trend = 'medium';
        if (current.questions >= avgQuestions * 1.2) { // 20% cao hơn TB
            trend = 'high';
        } else if (current.questions < avgQuestions * 0.7) { // 30% thấp hơn TB
            trend = 'low';
        }
        
        // Hoặc dùng ngưỡng cố định:
        // if (current.questions > 100) trend = 'high';
        // else if (current.questions > 50) trend = 'medium';
        // else trend = 'low';
        
        return {
            classId: current.classId,
            className: current.className,
            questions: current.questions,
            trend: trend,
            change: change
        };
    });
    };

    
    // Sample engagement data
    // const engagementData = {
    //     week: [
    //         { className: "Web Development", questions: 156, trend: "high", change: "+15%" },
    //         { className: "Data Science", questions: 89, trend: "medium", change: "+8%" },
    //         { className: "Mobile App Dev", questions: 34, trend: "low", change: "-5%" },
    //         { className: "AI & ML", questions: 123, trend: "high", change: "+12%" },
    //     ],
    //     month: [
    //         { className: "Web Development", questions: 642, trend: "high", change: "+22%" },
    //         { className: "Data Science", questions: 378, trend: "medium", change: "+18%" },
    //         { className: "Mobile App Dev", questions: 145, trend: "low", change: "-3%" },
    //         { className: "AI & ML", questions: 512, trend: "high", change: "+25%" },
    //     ]
    // };

    useEffect(() => {
        const fetchClassroomData = async () => {
            try {
                if(role === "TEACHER") {
                    const teacherId = JSON.parse(localStorage.getItem('user')).id;
                    const response = await classService.getClassroomsByTeacherId(teacherId);
                    const currentWeekData = await classService.getTotalQuestionsByClassroomWeek(response);
                    const lastWeekData = await classService.getTotalQuestionsByClassroomLastWeek(response);

                    const currentMonthData = await classService.getTotalQuestionsByClassroomMonth(response);
                    const lastMonthData = await classService.getTotalQuestionsByClassroomLastMonth(response);


                    const weekEngagement = calculateEngagement(currentWeekData, lastWeekData);
                    const monthEngagement = calculateEngagement(currentMonthData, lastMonthData);
                    setEngagementData({
                        week: weekEngagement,
                        month: monthEngagement
                    });
                    // const engagementData = {
                    //     week: weekEngagement,
                    //     month: monthEngagement
                    // }
                    // console.log("engagement",engagementData);
                    setClassrooms(response);
                } else {
                    const studentId = JSON.parse(localStorage.getItem('user')).id;
                    const response = await classService.getClassroomsByStudentId(studentId);
                    setClassrooms(response);
                }
            } catch (error) {
                console.error('Error fetching classroom data:', error);
            }
        };
        fetchClassroomData();
    }, [role]);

    const getEngagementColor = (questions) => {
        if (questions > 100) return 'text-green-600 bg-green-50';
        if (questions > 50) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    const getHeatmapIntensity = (questions) => {
        const currentData = engagementData[timePeriod];
        const maxQuestions = Math.max(...currentData.map(c => c.questions));
        const intensity = (questions / maxQuestions) * 100;
        if (intensity > 75) return 'bg-blue-600';
        if (intensity > 50) return 'bg-blue-500';
        if (intensity > 25) return 'bg-blue-400';
        return 'bg-blue-300';
    };

    return (
        <div className="min-h-screen relative bg-gradient-to-br from-blue-50 to-white">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 opacity-5">
                <img 
                    src="/hackathon.jpg" 
                    alt="Background" 
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Main Layout */}
            <div className="relative z-10 flex">
                {/* Left Sidebar - Only for Teachers */}
                {role === "TEACHER" && (
                    <aside className="w-64 bg-white shadow-xl border-r border-blue-100 min-h-screen">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-blue-600 mb-6">Dashboard</h2>
                            <nav className="space-y-2">
                                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-50 text-blue-600 font-medium">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                    </svg>
                                    Classrooms
                                </a>
                                <button 
                                    onClick={() => {
                                        localStorage.removeItem('user');
                                        navigate('/');
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                                    </svg>
                                    Logout
                                </button>
                            </nav>

                            {/* Stats */}
                            <div className="mt-8 space-y-4">
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <div className="text-2xl font-bold text-blue-600">{classrooms.length}</div>
                                    <div className="text-sm text-gray-600">Total Classes</div>
                                </div>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <main className={`flex-1 transition-all duration-300 ${isHeatmapOpen && role === "TEACHER" ? 'mr-96' : 'mr-0'}`}>
                    <div className="container mx-auto px-6 py-8">
                        {/* Header */}
                        <div className="mb-8 flex justify-between items-center">
                            <div>
                                <h1 className="text-4xl font-bold text-blue-600 mb-2">My Classrooms</h1>
                                <p className="text-gray-600">Manage and join your learning sessions</p>
                            </div>
                            {role === "TEACHER" && (
                                <button 
                                    onClick={() => setIsHeatmapOpen(!isHeatmapOpen)}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {isHeatmapOpen ? 'Hide Analytics' : 'Show Analytics'}
                                </button>
                            )}
                        </div>

                        {/* Classrooms Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {classrooms.map((classroom) => (
                                <div 
                                    key={role === "TEACHER" ? classroom.id : classroom.classes_id}
                                    className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-100 hover:border-blue-300 cursor-pointer group"
                                >
                                    {/* Card Header */}
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 group-hover:from-blue-700 group-hover:to-blue-600 transition-all">
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {role === "TEACHER" ? classroom.className : classroom.teacher_fullName}
                                        </h3>
                                        <p className="text-blue-100 text-sm">
                                            {role === "TEACHER" ? JSON.parse(localStorage.getItem('user')).fullName : classroom.teacher_fullName}
                                        </p>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center gap-3 text-gray-700">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm">
                                                {role === "TEACHER" ? classroom.scheduleTime : classroom.classes_scheduleTime}
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="pt-4 flex gap-3">
                                            <button 
                                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all text-sm" 
                                                onClick={() => {
                                                    if(role === "TEACHER") {
                                                        navigate('/chat', {state: {classroomId: classroom.id}})
                                                    } else {
                                                        navigate('/chat', {state: {classroomId: classroom.classes_id}})
                                                    }
                                                }}
                                            >
                                                Enter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty State */}
                        {classrooms.length === 0 && (
                            <div className="text-center py-20">
                                <div className="bg-white rounded-xl shadow-lg p-12 max-w-md mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <h3 className="text-xl font-bold text-gray-700 mb-2">No Classrooms Yet</h3>
                                    <p className="text-gray-500 mb-6">Create your first classroom to get started</p>
                                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all">
                                        Create Classroom
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {/* Right Sidebar - Heatmap Panel - Only for Teachers */}
                {role === "TEACHER" && (
                    <aside className={`fixed top-0 right-0 h-screen bg-white shadow-2xl border-l border-blue-100 overflow-y-auto transition-all duration-300 ${isHeatmapOpen ? 'w-96 translate-x-0' : 'w-96 translate-x-full'}`}>
                    <div className="p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-blue-600">Analytics Dashboard</h2>
                            <button 
                                onClick={() => setIsHeatmapOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Time Period Selector */}
                        <div className="mb-6">
                            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setTimePeriod('week')}
                                    className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                                        timePeriod === 'week' 
                                            ? 'bg-blue-600 text-white shadow-md' 
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    This Week
                                </button>
                                <button
                                    onClick={() => setTimePeriod('month')}
                                    className={`flex-1 py-2 px-4 rounded-md font-medium text-sm transition-all ${
                                        timePeriod === 'month' 
                                            ? 'bg-blue-600 text-white shadow-md' 
                                            : 'text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    This Month
                                </button>
                            </div>
                        </div>

                        {/* Class Engagement */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Class Engagement ({timePeriod === 'week' ? 'Weekly' : 'Monthly'})
                            </h3>
                            <div className="space-y-3">
                                {engagementData[timePeriod]?.map((cls) => (
                                    <div key={cls.className} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-medium text-gray-800">{cls.className}</h4>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEngagementColor(cls.questions)}`}>
                                                    {cls.questions} Q
                                                </span>
                                                <span className={`text-xs font-semibold ${
                                                    cls.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {cls.change}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Progress Bar */}
                                        <div className="mb-2">
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full transition-all duration-500 ${getHeatmapIntensity(cls.questions)}`}
                                                    style={{width: `${(cls.questions / Math.max(...engagementData[timePeriod]?.map(c => c.questions))) * 100}%`}}
                                                ></div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {cls.trend === 'high' && (
                                                <div className="flex items-center gap-1 text-green-600 text-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                                    </svg>
                                                    High engagement
                                                </div>
                                            )}
                                            {cls.trend === 'medium' && (
                                                <div className="flex items-center gap-1 text-yellow-600 text-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Medium engagement
                                                </div>
                                            )}
                                            {cls.trend === 'low' && (
                                                <div className="flex items-center gap-1 text-red-600 text-sm">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" />
                                                    </svg>
                                                    Needs attention
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Insights */}
                        <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-4 border border-blue-100">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">💡 Nhận Xét & Đề Xuất</h3>
                            <ul className="space-y-3 text-sm text-gray-700">
                                {/* Dynamic insights based on engagement data */}
                                {engagementData[timePeriod]?.map((cls, index) => {
                                    const changeValue = parseInt(cls.change);
                                    let insight = '';
                                    let icon = '';
                                    
                                    if (cls.trend === 'high' && changeValue > 15) {
                                        insight = `<strong>${cls.className}</strong>: Lớp đang có sự tương tác rất tốt (${cls.change}). Hãy duy trì phong độ này và chia sẻ phương pháp giảng dạy với các lớp khác.`;
                                        icon = '🎯';
                                    } else if (cls.trend === 'high' && changeValue >= 0) {
                                        insight = `<strong>${cls.className}</strong>: Tương tác tốt với ${cls.questions} câu hỏi. Tiếp tục khuyến khích sinh viên đặt câu hỏi để duy trì đà tăng trưởng ${cls.change}.`;
                                        icon = '✅';
                                    } else if (cls.trend === 'medium' && changeValue > 0) {
                                        insight = `<strong>${cls.className}</strong>: Đang có tiến bộ tích cực (${cls.change}). Nên tăng thêm hoạt động tương tác để đạt mức cao hơn.`;
                                        icon = '📈';
                                    } else if (cls.trend === 'medium' && changeValue === 0) {
                                        insight = `<strong>${cls.className}</strong>: Tương tác ổn định nhưng chưa có tăng trưởng. Cân nhắc thử nghiệm các phương pháp giảng dạy mới để kích thích sinh viên.`;
                                        icon = '⚖️';
                                    } else if (cls.trend === 'low' && changeValue < 0) {
                                        insight = `<strong>${cls.className}</strong>: Cần chú ý! Tương tác đang giảm ${cls.change}. Đề xuất: Tổ chức buổi trao đổi với sinh viên để hiểu rõ nguyên nhân và điều chỉnh kịp thời.`;
                                        icon = '⚠️';
                                    } else if (cls.trend === 'low' && changeValue >= 0) {
                                        insight = `<strong>${cls.className}</strong>: Tương tác còn thấp. Nên tăng cường động viên sinh viên đặt câu hỏi và tạo môi trường học tập cởi mở hơn.`;
                                        icon = '🔔';
                                    }
                                    
                                    return (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-lg mt-0.5">{icon}</span>
                                            <span dangerouslySetInnerHTML={{__html: insight}}></span>
                                        </li>
                                    );
                                })}
                                
                                {/* Overall summary */}
                                <li className="flex items-start gap-2 pt-2 border-t border-blue-100">
                                    <span className="text-blue-600 mt-1 text-lg">💼</span>
                                    <span>
                                        <strong>Tổng quan:</strong> {
                                            timePeriod === 'week' 
                                                ? 'Trong tuần này, hãy tập trung vào các lớp có xu hướng giảm để kịp thời can thiệp. Các lớp tăng trưởng tốt nên được duy trì và nhân rộng kinh nghiệm.'
                                                : 'Trong tháng này, xu hướng chung cho thấy sự phát triển tích cực. Tiếp tục theo dõi và hỗ trợ các lớp cần cải thiện.'
                                        }
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </aside>
                )}
            </div>
        </div>
    )
}