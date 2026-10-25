import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import { Link } from 'react-router-dom'

const Cart = () => {
  const {
    products,
    currency,
    cartItem,
    updateQuantity,
    navigate
  } = useContext(ShopContext)

  const cartData = Object.entries(cartItem).flatMap(([itemId, sizes]) =>
    Object.entries(sizes)
      .filter(([, quantity]) => Number(quantity) > 0)
      .map(([size, quantity]) => ({
        _id: itemId,
        size,
        quantity: Number(quantity)
      }))
  )

  return (
    <div className='border-t border-slate-200 pt-10 sm:pt-14 px-4 sm:px-8 lg:px-12'>

      {/* Title */}
      <div className='mb-8'>
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {/* Empty Cart */}
      {cartData.length === 0 ? (
        <div className='min-h-[400px] flex flex-col items-center justify-center text-center bg-slate-50 border border-slate-200 rounded-2xl px-5'>
          <div className='w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-5'>
            <span className='text-3xl'>🛍️</span>
          </div>

          <h2 className='text-2xl sm:text-3xl font-semibold text-[#0F172A]'>
            Your Cart is Empty
          </h2>

          <p className='text-slate-500 mt-2 max-w-md'>
            Looks like you haven't added anything to your cart yet.
            Explore our latest collection and find something you love.
          </p>

          <Link
            to='/collection'
            className='mt-6 bg-[#F97316] text-white px-7 py-3 rounded-lg font-medium hover:bg-[#ea580c] hover:-translate-y-1 transition-all duration-300 shadow-md'
          >
            SHOP NOW
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className='space-y-4'>
            {cartData.map((item) => {
              const productData = products.find(
                (product) => product._id === item._id
              )

              if (!productData) return null

              return (
                <div
                  key={`${item._id}-${item.size}`}
                  className='bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300'
                >
                  <div className='grid grid-cols-[1fr_auto] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 sm:gap-6'>

                    {/* Product */}
                    <div className='flex items-start gap-4 sm:gap-6'>
                      <div className='w-20 h-24 sm:w-28 sm:h-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0'>
                        <img
                          className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                          src={productData.image?.[0] || productData.Image?.[0]}
                          alt={productData.name}
                        />
                      </div>

                      <div className='pt-1'>
                        <h3 className='text-sm sm:text-lg font-semibold text-[#0F172A]'>
                          {productData.name}
                        </h3>

                        <p className='text-[#F97316] font-semibold mt-2'>
                          {currency}{productData.price}
                        </p>

                        <div className='flex items-center gap-3 mt-3'>
                          <span className='text-xs sm:text-sm text-slate-500'>
                            Size:
                          </span>

                          <span className='px-3 py-1 border border-slate-200 bg-slate-50 rounded-md text-xs sm:text-sm font-medium text-[#0F172A]'>
                            {item.size}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity + Remove */}
                    <div className='flex items-center gap-3 sm:gap-5'>
                      <div className='flex items-center border border-slate-300 rounded-lg overflow-hidden'>
                        <button
                          type='button'
                          aria-label='Decrease quantity'
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className='w-8 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-semibold text-[#0F172A] hover:bg-[#F97316] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition'
                        >
                          −
                        </button>

                        <span className='w-8 sm:w-10 text-center text-sm font-semibold text-[#0F172A]'>
                          {item.quantity}
                        </span>

                        <button
                          type='button'
                          aria-label='Increase quantity'
                          onClick={() =>
                            updateQuantity(
                              item._id,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className='w-8 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-lg font-semibold text-[#0F172A] hover:bg-[#F97316] hover:text-white transition'
                        >
                          +
                        </button>
                      </div>

                      <button
                        type='button'
                        aria-label='Remove product'
                        onClick={() =>
                          updateQuantity(item._id, item.size, 0)
                        }
                        className='w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 hover:scale-105 transition'
                      >
                        <img
                          src={assets.bin_icon}
                          alt='Remove'
                          className='w-4 sm:w-5'
                        />
                      </button>
                    </div>

                    {/* Desktop Subtotal */}
                    <div className='hidden sm:block text-right'>
                      <p className='text-xs text-slate-400 mb-1'>
                        Subtotal
                      </p>

                      <p className='font-semibold text-[#0F172A]'>
                        {currency}{Number(productData.price) * item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Subtotal */}
                  <div className='flex sm:hidden justify-between items-center mt-4 pt-3 border-t border-slate-100'>
                    <span className='text-sm text-slate-500'>
                      Subtotal
                    </span>

                    <span className='font-semibold text-[#0F172A]'>
                      {currency}{Number(productData.price) * item.quantity}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Cart Bottom */}
          <div className='flex flex-col lg:flex-row justify-between items-start gap-8 my-10'>
            <Link
              to='/collection'
              className='inline-flex items-center gap-2 text-[#0F172A] font-medium hover:text-[#F97316] transition'
            >
              <span className='text-xl'>←</span>
              Continue Shopping
            </Link>

            {/* Cart Total */}
            <div className='w-full lg:w-[450px] bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm'>
              <CartTotal />

              <button
                type='button'
                onClick={() => navigate('/place-order')}
                className='w-full mt-5 bg-[#0F172A] text-white py-3.5 rounded-lg font-medium hover:bg-[#F97316] hover:-translate-y-1 transition-all duration-300 shadow-md'
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart