import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
export default function Classroom() {
    const { state } = useLocation();
    // // Sample classroom data
    // const classrooms = [
    //     { id: 1, name: "Web Development", instructor: "John Doe", students: 24, schedule: "Mon, Wed, Fri 10:00 AM" },
    //     { id: 2, name: "Data Science", instructor: "Jane Smith", students: 18, schedule: "Tue, Thu 2:00 PM" },
    //     { id: 3, name: "Mobile App Dev", instructor: "Mike Johnson", students: 20, schedule: "Mon, Wed 3:00 PM" },
    //     { id: 4, name: "AI & Machine Learning", instructor: "Sarah Wilson", students: 15, schedule: "Tue, Thu 10:00 AM" },
    //     { id: 5, name: "Cloud Computing", instructor: "David Brown", students: 22, schedule: "Wed, Fri 1:00 PM" },
    //     { id: 6, name: "Cybersecurity", instructor: "Emily Davis", students: 19, schedule: "Mon, Thu 4:00 PM" },
    // ]
    const [classrooms,setClassrooms] = useState([]);
    useEffect(() => {
        // Fetch classroom data using state.classroomId
        const fetchClassroomData = async () => {
            try {
                if(role == "TEACHER")
                {
                    const teacherId = state.id;
                    const response = await axios.get(`http://localhost:10000/hackathon/classrooms/${teacherId}`);
                    setClassrooms(response.data);
                }
                else{
                    const studentId = state.id;
                    const response = await axios.get(`http://localhost:10000/hackathon/student/classrooms/${studentId}`);
                    setClassrooms(response.data);
                }
                //console.log('Classroom Data:', response.data);
                
                // You can set the fetched data to state here
            } catch (error) {
                console.error('Error fetching classroom data:', error);
            }
        };
        fetchClassroomData();
    }, []);

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

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-blue-600 mb-2">My Classrooms</h1>
                    <p className="text-gray-600">Manage and join your learning sessions</p>
                </div>

                {/* Classrooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classrooms.map((classroom) => (
                        <div 
                            key={classroom.id}
                            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-100 hover:border-blue-300 cursor-pointer group"
                        >
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 group-hover:from-blue-700 group-hover:to-blue-600 transition-all">
                                <h3 className="text-xl font-bold text-white mb-2">{classroom.className}</h3>
                                <p className="text-blue-100 text-sm">{classroom.instructor}</p>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 space-y-4">

                                <div className="flex items-center gap-3 text-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm">{classroom.scheduleTime}</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 flex gap-3">
                                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all text-sm">
                                        Enter
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State (if no classrooms) */}
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
        </div>
    )
}