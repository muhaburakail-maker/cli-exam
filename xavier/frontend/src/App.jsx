import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              MyExam - Educational Platform
            </h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

function HomePage() {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Welcome to MyExam</h2>
      <p className="text-gray-600">Your educational platform for success</p>
    </div>
  )
}

export default App
