
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import ResetPassword from './pages/ResetPassword'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import ShippingDelivery from './pages/ShippingDelivery'
import ReturnsExchanges from './pages/ReturnsExchanges'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsConditions from './pages/TermsConditions'
import ScrollToTop from './components/ScrollToTop'
import AIChatbot from './components/AIChatbot'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <ScrollToTop />

      <Navbar />
      <SearchBar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />

        <Route
          path='/shipping-delivery'
          element={<ShippingDelivery />}
        />

        <Route
          path='/returns-exchanges'
          element={<ReturnsExchanges />}
        />

        <Route
          path='/privacy-policy'
          element={<PrivacyPolicy />}
        />

        <Route
          path='/terms-conditions'
          element={<TermsConditions />}
        />

        <Route
          path='/reset-password/:token'
          element={<ResetPassword />}
        />
      </Routes>

      <Footer />

      {/* Free AI Fashion Chatbot */}
      <AIChatbot />
    </div>
  )
}

export default App
