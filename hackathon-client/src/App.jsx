import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Login from '#pages/Login.jsx';
import Classroom from '#pages/Classroom.jsx';
import HomeLayout from '#layouts/HomeLayout.jsx';
import ChatLayout from '#/layouts/ChatLayout.jsx';
import Chatbox from '#/pages/Chatbox.jsx';

function App() {
  const [count, setCount] = useState(0)
  const [healthStatus, setHealthStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  // useEffect(() => {
  //   checkHealth()
  // }, [])

  // const checkHealth = async () => {
  //   setLoading(true)
  //   try {
  //     const response = await axios.get('http://localhost:3000/hackathon/healthcheck')
  //     setHealthStatus(response.data)
  //   } catch (error) {
  //     console.error('Health check failed:', error)
  //     setHealthStatus({ status: 'error', error: error.message })
  //   } finally {
  //     setLoading(false)
  //   }
  // }
  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          { 
            path:'/' ,element: <Login />
          },
          {
            path: '/classroom', element: <Classroom />
          },
        ]
      },
      {
          path: "/chat",
          element: <ChatLayout />,         
          children: [
            {
              index: true,                    
              element: <Chatbox />,
            },
          ],
        },
    ]
  )

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
