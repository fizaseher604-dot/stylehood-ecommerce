import React from 'react'
import { assets } from '../assets/assets.js'

const Navbar = ({ setToken }) => {
  return (
    <div className='flex items-center justify-between py-3 px-[4%] bg-[#0F172A] border-b border-slate-700'>

      <img
        className='w-[max(10%,80px)]'
        src={assets.logo}
        alt="Stylehood Logo"
      />

      <div className='flex items-center gap-4'>
        <span className='hidden sm:block text-sm text-slate-300'>
          Admin Panel
        </span>

        <button
          onClick={() => setToken('')}
          className='bg-[#F97316] hover:bg-orange-600 text-white px-5 py-2 sm:px-7 rounded-full text-xs sm:text-sm font-medium transition-colors'
        >
          Logout
        </button>
      </div>

    </div>
  )
}

export default Navbar