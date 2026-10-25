
import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'

const Sidebar = () => {
  const linkStyle = ({ isActive }) =>
    `group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200 ${
      isActive
        ? 'bg-[#0F172A] text-white shadow-md shadow-slate-200'
        : 'text-gray-600 hover:bg-orange-50 hover:text-[#F97316]'
    }`

  return (
    <aside className="min-h-screen w-[18%] shrink-0 border-r border-slate-200 bg-white shadow-sm sm:w-[220px]">

      <div className="flex flex-col gap-2 px-3 pb-6 pt-6 sm:px-4">

        {/* Sidebar Heading */}
        <div className="mb-3 hidden px-3 md:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F97316]">
            STYLEHOOD
          </p>
          <p className="mt-1 text-xs font-medium text-slate-400">
            Management Panel
          </p>
        </div>

        {/* Dashboard */}
        <NavLink
          to="/"
          end
          className={linkStyle}
          title="Dashboard"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center text-lg">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <rect x="3" y="3" width="8" height="8" rx="1.5" />
              <rect x="13" y="3" width="8" height="5" rx="1.5" />
              <rect x="13" y="10" width="8" height="11" rx="1.5" />
              <rect x="3" y="13" width="8" height="8" rx="1.5" />
            </svg>
          </span>
          <p className="hidden text-sm font-medium md:block">
            Dashboard
          </p>
        </NavLink>

        {/* Add Items */}
        <NavLink
          to="/add"
          className={linkStyle}
          title="Add Items"
        >
          <img
            className="h-5 w-5 shrink-0 object-contain"
            src={assets.add_icon}
            alt=""
          />
          <p className="hidden text-sm font-medium md:block">
            Add Items
          </p>
        </NavLink>

        {/* List Items */}
        <NavLink
          to="/list"
          className={linkStyle}
          title="List Items"
        >
          <img
            className="h-5 w-5 shrink-0 object-contain"
            src={assets.order_icon}
            alt=""
          />
          <p className="hidden text-sm font-medium md:block">
            List Items
          </p>
        </NavLink>

        {/* Orders */}
        <NavLink
          to="/orders"
          className={linkStyle}
          title="Orders"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M6 3h12l3 4v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7l3-4Z" />
              <path d="M3 7h18M9 11h6" />
            </svg>
          </span>
          <p className="hidden text-sm font-medium md:block">
            Orders
          </p>
        </NavLink>

        {/* Sidebar Footer */}
        <div className="mt-6 hidden border-t border-slate-100 px-3 pt-4 md:block">
          <p className="text-xs leading-5 text-slate-400">
            Manage your store with Stylehood Admin.
          </p>
        </div>

      </div>
    </aside>
  )
}

export default Sidebar
