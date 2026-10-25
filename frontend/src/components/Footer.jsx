
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { FaInstagram, FaFacebookF, FaPinterestP } from 'react-icons/fa'

const Footer = () => {
  const exploreLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collection', path: '/collection' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact Us', path: '/contact' },
  ]

  const helpLinks = [
    { name: 'Shipping & Delivery', path: '/shipping-delivery' },
    { name: 'Returns & Exchange', path: '/returns-exchanges' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-conditions' },
  ]

  const socialLinks = [
    {
      name: 'Instagram',
      icon: <FaInstagram />,
      url: 'https://www.instagram.com/',
    },
    {
      name: 'Facebook',
      icon: <FaFacebookF />,
      url: 'https://www.facebook.com/',
    },
    {
      name: 'Pinterest',
      icon: <FaPinterestP />,
      url: 'https://www.pinterest.com/',
    },
  ]

  return (
    <footer className="relative mt-16 sm:mt-20 bg-[#0B1120] text-white overflow-hidden">

      {/* Orange Accent */}
      <div className="h-1 w-full bg-gradient-to-r from-[#F97316] via-orange-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">

        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9 sm:gap-10 lg:gap-12 py-10 sm:py-14 lg:py-16">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="inline-block">
              <img
                src={assets.logo}
                alt="Stylehood"
                className="w-32 sm:w-36 mb-5"
              />
            </Link>

            <p className="text-sm text-gray-400 leading-7 max-w-md">
              Discover fashion that feels as good as it looks.
              Stylehood brings you modern styles, timeless pieces,
              and effortless everyday fashion for every moment.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-700 text-gray-300 hover:bg-[#F97316] hover:border-[#F97316] hover:text-white transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-bold tracking-[2px] mb-5">
              EXPLORE
            </h3>

            <div className="w-9 h-[2px] bg-[#F97316] mb-5" />

            <ul className="flex flex-col gap-3">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-[#F97316] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm font-bold tracking-[2px] mb-5">
              CUSTOMER CARE
            </h3>

            <div className="w-9 h-[2px] bg-[#F97316] mb-5" />

            <ul className="flex flex-col gap-3">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 hover:text-[#F97316] transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-5 sm:py-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-5">

          <p className="text-xs text-gray-500 text-center sm:text-left leading-6">
            © 2026 Stylehood. All rights reserved.
          </p>

          <p className="text-xs text-gray-500 text-center">
            Designed with{' '}
            <span className="text-[#F97316]">♥</span>
            {' '}for your style.
          </p>

        </div>

      </div>
    </footer>
  )
}

export default Footer