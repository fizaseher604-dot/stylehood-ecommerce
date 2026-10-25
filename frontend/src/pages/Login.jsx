import  { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login')

  const { setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)

      // Forgot Password
      if (currentState === 'Forget Password') {
        const response = await axios.post(
          backendUrl + '/api/user/forgot-password',
          { email }
        )

        if (response.data.success) {
          toast.success(
            response.data.message ||
            'If an account exists for this email, password reset instructions will be sent.'
          )
        } else {
          toast.error(response.data.message || 'Unable to process request')
        }

        return
      }

      // Sign Up
      if (currentState === 'Sign Up') {
        const response = await axios.post(
          backendUrl + '/api/user/register',
          {
            name,
            email,
            password
          }
        )

        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)

          toast.success(
            response.data.message || 'Account created successfully!'
          )

          navigate('/')
        } else {
          toast.error(response.data.message || 'Registration failed')
        }
      }

      // Login
      else {
        const response = await axios.post(
          backendUrl + '/api/user/login',
          {
            email,
            password
          }
        )

        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem('token', response.data.token)

          toast.success(
            response.data.message || 'Login successful!'
          )

          navigate('/')
        } else {
          toast.error(response.data.message || 'Login failed')
        }
      }
    } catch (error) {
      console.error(error)

      toast.error(
        error.response?.data?.message || 'Something went wrong!'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-[75vh] flex items-center justify-center px-4 py-12 bg-[#F8FAFC]'>

      <form
        onSubmit={onSubmitHandler}
        className='w-full sm:max-w-md bg-white border border-[#E2E8F0] rounded-2xl shadow-xl px-6 sm:px-10 py-8 sm:py-10'
      >

        {/* Heading */}
        <div className='flex flex-col items-center mb-8'>

          <p className='text-3xl font-semibold text-[#0F172A] tracking-tight'>
            {currentState}
          </p>

          <div className='flex items-center gap-2 mt-3'>
            <span className='w-10 h-[2px] bg-[#F97316]'></span>
            <span className='w-2 h-2 rounded-full bg-[#F97316]'></span>
            <span className='w-10 h-[2px] bg-[#F97316]'></span>
          </div>

          <p className='text-sm text-[#64748B] mt-3 text-center'>
            {currentState === 'Login'
              ? 'Welcome back to Stylehood'
              : currentState === 'Forget Password'
                ? 'Enter your email to reset your password'
                : 'Create your Stylehood account'}
          </p>
        </div>

        {/* Name */}
        {currentState === 'Sign Up' && (
          <div className='mb-4'>
            <label className='block text-sm font-medium text-[#0F172A] mb-1.5'>
              Name
            </label>

            <input
              type='text'
              onChange={(e) => setName(e.target.value)}
              value={name}
              className='w-full px-4 py-3 rounded-lg border border-[#E2E8F0] outline-none text-sm transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]'
              placeholder='Enter your name'
              required
            />
          </div>
        )}

        {/* Email */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-[#0F172A] mb-1.5'>
            Email
          </label>

          <input
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='w-full px-4 py-3 rounded-lg border border-[#E2E8F0] outline-none text-sm transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]'
            placeholder='Enter your email'
            required
          />
        </div>

        {/* Password */}
        {currentState !== 'Forget Password' && (
          <div className='mb-3'>
            <label className='block text-sm font-medium text-[#0F172A] mb-1.5'>
              Password
            </label>

            <input
              type='password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='w-full px-4 py-3 rounded-lg border border-[#E2E8F0] outline-none text-sm transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]'
              placeholder='Enter your password'
              required
              minLength={currentState === 'Sign Up' ? 8 : undefined}
            />
          </div>
        )}

        {/* Links */}
        <div className='w-full flex justify-between items-center text-sm mt-3 mb-6'>

          {currentState === 'Login' && (
            <p
              onClick={() => setCurrentState('Forget Password')}
              className='text-[#64748B] hover:text-[#F97316] cursor-pointer transition'
            >
              Forgot Password?
            </p>
          )}

          {currentState === 'Forget Password' ? (
            <p
              onClick={() => setCurrentState('Login')}
              className='text-[#F97316] font-medium cursor-pointer hover:text-[#0F172A] transition'
            >
              Back to Login
            </p>
          ) : currentState === 'Login' ? (
            <p
              onClick={() => setCurrentState('Sign Up')}
              className='text-[#F97316] font-medium cursor-pointer hover:text-[#0F172A] transition'
            >
              Create Account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState('Login')}
              className='ml-auto text-[#F97316] font-medium cursor-pointer hover:text-[#0F172A] transition'
            >
              Login here
            </p>
          )}

        </div>

        {/* Button */}
        <button
          type='submit'
          disabled={loading}
          className='w-full bg-[#0F172A] text-white font-medium py-3 rounded-lg hover:bg-[#F97316] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {loading
            ? 'Please wait...'
            : currentState === 'Login'
              ? 'Sign In'
              : currentState === 'Forget Password'
                ? 'Send Reset Instructions'
                : 'Sign Up'}
        </button>

      </form>
    </div>
  )
}

export default Login