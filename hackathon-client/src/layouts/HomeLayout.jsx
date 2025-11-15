import { Outlet } from 'react-router-dom'
export default function HomeLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Hackathon Platform</h1>
          <p className="text-blue-100 mt-2">Innovate. Collaborate. Create.</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow">
          <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-blue-700 text-white mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2024 Hackathon Inc. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-blue-200 hover:text-white transition-colors">About</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">Contact</a>
              <a href="#" className="text-blue-200 hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}