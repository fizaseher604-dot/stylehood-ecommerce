import  { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const Navbar = () => {
  const [visible, setVisible] = useState(false)

  const {
    setShowSearch,
    getCartCount,
    token,
    setToken,
    setCartItem
  } = useContext(ShopContext)

  const navigate = useNavigate()

  // Logout functionality
  const handleLogout = () => {
     navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItem({})
   
  }

  // Profile icon functionality
  const handleProfileClick = () => {
    if (token) {
      navigate('/')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className='sticky top-0 z-50 flex items-center justify-between h-20 px-6 lg:px-12 font-medium bg-[#0F172A]/95 backdrop-blur-md shadow-lg'>

      {/* Logo */}
      <Link to='/'>
        <img
          src={assets.logo}
          alt='logo'
          className='w-36 cursor-pointer hover:scale-105 transition duration-300'
        />
      </Link>

      {/* Desktop Navigation */}
      <ul className='hidden sm:flex gap-8 text-sm'>

        <NavLink
          to='/'
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${
              isActive ? 'text-[#F97316]' : 'text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <p>HOME</p>
              {isActive && (
                <hr className='w-6 border-none h-[1.5px] bg-[#F97316]' />
              )}
            </>
          )}
        </NavLink>

        <NavLink
          to='/collection'
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${
              isActive ? 'text-[#F97316]' : 'text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <p>COLLECTION</p>
              {isActive && (
                <hr className='w-6 border-none h-[1.5px] bg-[#F97316]' />
              )}
            </>
          )}
        </NavLink>

        <NavLink
          to='/about'
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${
              isActive ? 'text-[#F97316]' : 'text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <p>ABOUT</p>
              {isActive && (
                <hr className='w-6 border-none h-[1.5px] bg-[#F97316]' />
              )}
            </>
          )}
        </NavLink>

        <NavLink
          to='/contact'
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 ${
              isActive ? 'text-[#F97316]' : 'text-white'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <p>CONTACT</p>
              {isActive && (
                <hr className='w-6 border-none h-[1.5px] bg-[#F97316]' />
              )}
            </>
          )}
        </NavLink>

      </ul>

      {/* Right Side Icons */}
      <div className='flex items-center gap-6'>

        {/* Search */}
        <img
          onClick={() => setShowSearch(true)}
          src={assets.search_icon}
          alt='Search'
          className='w-6 cursor-pointer hover:scale-110 transition duration-300'
        />

        {/* Profile Dropdown */}
        <div className='group relative'>

          <img
            onClick={handleProfileClick}
            src={assets.profile_icon}
            alt='Profile'
            className='w-6 cursor-pointer hover:scale-110 transition duration-300'
          />

          { token && 
          <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
            <div className='flex flex-col gap-2 w-44 py-4 px-5 bg-white text-slate-700 rounded-xl shadow-2xl border border-slate-200'>

              <p
                onClick={() => navigate('/')}
                className='cursor-pointer hover:text-[#F97316] hover:bg-[#FFF7ED] px-2 py-1 rounded'
              >
                My Profile
              </p>

              <p
                onClick={() => navigate('/orders')}
                className='cursor-pointer hover:text-[#F97316] hover:bg-[#FFF7ED] px-2 py-1 rounded'
              >
                Orders
              </p>

              {token ? (
                <p
                  onClick={handleLogout}
                  className='cursor-pointer hover:text-[#F97316] hover:bg-[#FFF7ED] px-2 py-1 rounded'
                >
                  Logout
                </p>
              ) : (
                <p
                  onClick={() => navigate('/login')}
                  className='cursor-pointer hover:text-[#F97316] hover:bg-[#FFF7ED] px-2 py-1 rounded'
                >
                  Login
                </p>
              )}

            </div>
          </div>}
        </div>

        {/* Cart */}
        <Link to='/cart' className='relative'>
          <img
            src={assets.cart_icon}
            alt='Cart'
            className='w-7 cursor-pointer hover:scale-110 transition duration-300'
          />

          <p className='absolute -top-2 -right-2 bg-[#F97316] text-white text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center shadow-lg'>
            {getCartCount()}
          </p>
        </Link>

        {/* Mobile Menu Button */}
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className='w-6 cursor-pointer sm:hidden'
          alt='Menu'
        />

      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen bg-[#0F172A] text-white transition-all duration-300 ease-in-out overflow-hidden z-50 ${
          visible ? 'w-72' : 'w-0'
        }`}
      >
        <div className='flex flex-col text-white'>

          {/* Back */}
          <div
            onClick={() => setVisible(false)}
            className='flex items-center gap-4 p-5 cursor-pointer border-b border-gray-700'
          >
            <img
              className='h-4 rotate-180 invert'
              src={assets.dropdown_icon}
              alt=''
            />
            <p className='text-sm hover:text-[#F97316]'>Back</p>
          </div>

          {/* Mobile Links */}
          <NavLink
            onClick={() => setVisible(false)}
            className={({ isActive }) =>
              `py-4 pl-8 text-sm border-b border-gray-700 transition ${
                isActive
                  ? 'text-[#F97316] border-l-4 border-l-[#F97316]'
                  : 'text-white hover:text-[#F97316] hover:bg-[#1E293B]'
              }`
            }
            to='/'
          >
            HOME
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className={({ isActive }) =>
              `py-4 pl-8 text-sm border-b border-gray-700 transition ${
                isActive
                  ? 'text-[#F97316] border-l-4 border-l-[#F97316]'
                  : 'text-white hover:text-[#F97316] hover:bg-[#1E293B]'
              }`
            }
            to='/collection'
          >
            COLLECTION
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className={({ isActive }) =>
              `py-4 pl-8 text-sm border-b border-gray-700 transition ${
                isActive
                  ? 'text-[#F97316] border-l-4 border-l-[#F97316]'
                  : 'text-white hover:text-[#F97316] hover:bg-[#1E293B]'
              }`
            }
            to='/about'
          >
            ABOUT
          </NavLink>

          <NavLink
            onClick={() => setVisible(false)}
            className={({ isActive }) =>
              `py-4 pl-8 text-sm border-b border-gray-700 transition ${
                isActive
                  ? 'text-[#F97316] border-l-4 border-l-[#F97316]'
                  : 'text-white hover:text-[#F97316] hover:bg-[#1E293B]'
              }`
            }
            to='/contact'
          >
            CONTACT
          </NavLink>

          {/* Mobile Profile */}
          <p
            onClick={() => {
              setVisible(false)
              handleProfileClick()
            }}
            className='py-4 pl-8 text-sm border-b border-gray-700 cursor-pointer hover:text-[#F97316]'
          >
            MY PROFILE
          </p>

          {/* Mobile Orders */}
          <p
            onClick={() => {
              setVisible(false)
              navigate('/orders')
            }}
            className='py-4 pl-8 text-sm border-b border-gray-700 cursor-pointer hover:text-[#F97316]'
          >
            ORDERS
          </p>

          {/* Mobile Logout */}
          {token && (
            <p
              onClick={() => {
                setVisible(false)
                handleLogout()
              }}
              className='py-4 pl-8 text-sm border-b border-gray-700 cursor-pointer hover:text-[#F97316]'
            >
              LOGOUT
            </p>
          )}

        </div>
      </div>

    </div>
  )
}

export default Navbar