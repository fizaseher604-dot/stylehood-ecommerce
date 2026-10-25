import  { useState, useContext } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { backendUrl } = useContext(ShopContext)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        `${backendUrl}/api/user/reset-password`,
        {
          token,
          password,
        }
      )

      if (response.data.success) {
        toast.success(
          response.data.message || 'Password reset successfully!'
        )
        navigate('/login')
      } else {
        toast.error(
          response.data.message || 'Unable to reset password'
        )
      }
    } catch (error) {
      console.error('Reset password error:', error)

      toast.error(
        error.response?.data?.message ||
          'Reset link is invalid or has expired'
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
        <div className='flex flex-col items-center mb-8'>
          <p className='text-3xl font-semibold text-[#0F172A] tracking-tight'>
            Reset Password
          </p>

          <div className='flex items-center gap-2 mt-3'>
            <span className='w-10 h-[2px] bg-[#F97316]'></span>
            <span className='w-2 h-2 rounded-full bg-[#F97316]'></span>
            <span className='w-10 h-[2px] bg-[#F97316]'></span>
          </div>

          <p className='text-sm text-[#64748B] mt-3 text-center'>
            Enter your new password below
          </p>
        </div>

        <div className='mb-5'>
          <label className='block text-sm font-medium text-[#0F172A] mb-1.5'>
            New Password
          </label>

          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-4 py-3 rounded-lg border border-[#E2E8F0] outline-none text-sm transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]'
            placeholder='Enter new password'
            minLength={8}
            autoComplete='new-password'
            required
          />
        </div>

        <div className='mb-6'>
          <label className='block text-sm font-medium text-[#0F172A] mb-1.5'>
            Confirm Password
          </label>

          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='w-full px-4 py-3 rounded-lg border border-[#E2E8F0] outline-none text-sm transition focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]'
            placeholder='Confirm new password'
            minLength={8}
            autoComplete='new-password'
            required
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-[#0F172A] text-white font-medium py-3 rounded-lg hover:bg-[#F97316] transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {loading ? 'Please wait...' : 'Reset Password'}
        </button>

        <p
          onClick={() => navigate('/login')}
          className='text-center text-sm text-[#64748B] mt-6 cursor-pointer hover:text-[#F97316] transition'
        >
          Back to Login
        </p>
      </form>
    </div>
  )
}

export default ResetPassword