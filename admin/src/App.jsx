
import React, { useEffect, useState } from 'react'
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom'

import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Dashboard from './pages/Dashboard'
import Login from './components/Login'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = 'PKR'

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('token') || ''
  )

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <ToastContainer position="top-right" autoClose={2500} />

      {token === '' ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />

          <div className="flex min-h-[calc(100vh-70px)] w-full">
            <Sidebar />

            <main className="min-w-0 flex-1 overflow-x-hidden">
              <Routes>
                <Route
                  path="/"
                  element={<Dashboard token={token} />}
                />

                <Route
                  path="/add"
                  element={<Add token={token} />}
                />

                <Route
                  path="/list"
                  element={<List token={token} />}
                />

                <Route
                  path="/orders"
                  element={<Orders token={token} />}
                />

                <Route
                  path="*"
                  element={<Navigate to="/" replace />}
                />
              </Routes>
            </main>
          </div>
        </>
      )}
    </div>
  )
}

export default App
