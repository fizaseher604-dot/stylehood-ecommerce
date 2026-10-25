
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets.js'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (loading) return

    try {
      setLoading(true)

      const response = await axios.post(
        backendUrl + '/api/user/admin',
        { email, password }
      )

      if (response.data.success) {
        setToken(response.data.token)
        

        // Login ke baad Dashboard open karo
        navigate('/', { replace: true })

        toast.success('Welcome to Stylehood Admin!')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(
        error.response?.data?.message || error.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-8">

      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-xl sm:p-9">

        <div className="mb-8 flex flex-col items-center">
          <img
            className="mb-5 w-36 object-contain"
            src={assets.logo}
            alt="Stylehood Logo"
          />

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#F97316]">
            STYLEHOOD
          </p>

          <h1 className="text-2xl font-bold text-[#0F172A]">
            Admin Login
          </h1>

          <p className="mt-2 text-center text-sm text-slate-500">
            Welcome back! Please enter your details.
          </p>
        </div>

        <form onSubmit={onSubmitHandler}>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Email Address
            </label>

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
              type="email"
              placeholder="Enter your email"
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            className="w-full rounded-lg bg-[#F97316] py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

        </form>

        <div className="mt-7 border-t border-slate-100 pt-5">
          <p className="text-center text-xs text-slate-400">
            © 2026{' '}
            <span className="font-semibold text-[#0F172A]">
              Stylehood
            </span>{' '}
            · Admin Panel
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login
