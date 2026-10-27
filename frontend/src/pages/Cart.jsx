
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import CartTotal from '../components/CartTotal'
import { Link } from 'react-router-dom'

const Cart = () => {
  const {
    products,
    productsLoading,
    cartLoading,
    currency,
    cartItem,
    updateQuantity,
    navigate
} = useContext(ShopContext)

  const cartData = Object.entries(cartItem || {}).flatMap(
    ([itemId, sizes]) =>
      Object.entries(sizes || {})
        .filter(([, quantity]) => Number(quantity) > 0)
        .map(([size, quantity]) => ({
          _id: itemId,
          size,
          quantity: Number(quantity)
        }))
  )
  if (cartLoading || productsLoading) {
    return (
        <div className="w-full min-h-[60vh] flex flex-col items-center justify-center px-4">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-[#F97316] rounded-full animate-spin"></div>

            <p className="mt-5 text-[#0F172A] font-semibold text-lg">
                Loading your cart...
            </p>

            <p className="mt-1 text-sm text-slate-500">
                Please wait while we fetch your products.
            </p>
        </div>
    )
}

  return (
    <div className="w-full min-w-0 border-t border-slate-200 pt-7 sm:pt-12 px-3 sm:px-6 lg:px-12 pb-8">

      {/* Title */}
      <div className="mb-6 sm:mb-8">
        <Title text1="YOUR" text2="CART" />
      </div>

      {/* Empty Cart */}
      {cartData.length === 0 ? (
        <div className="min-h-[320px] sm:min-h-[400px] flex flex-col items-center justify-center text-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-5">
            <span className="text-3xl">🛍️</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-semibold text-[#0F172A]">
            Your Cart is Empty
          </h2>

          <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-md">
            Looks like you haven't added anything to your cart yet.
            Explore our latest collection and find something you love.
          </p>

          <Link
            to="/collection"
            className="mt-6 inline-flex items-center justify-center bg-[#F97316] text-white px-7 py-3 rounded-lg font-medium hover:bg-[#ea580c] transition-colors duration-300 shadow-md"
          >
            SHOP NOW
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="space-y-3 sm:space-y-4">
            {cartData.map((item) => {
              const productData = products.find(
                (product) => product._id === item._id
              )

              if (!productData) return null

              const image =
                productData.image?.[0] ||
                productData.Image?.[0] ||
                assets?.upload_area

              const subtotal =
                Number(productData.price || 0) * item.quantity

              return (
                <div
                  key={`${item._id}-${item.size}`}
                  className="min-w-0 bg-white border border-slate-200 rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  {/* Product Information */}
                  <div className="flex min-w-0 items-start gap-3 sm:gap-5">
                    <Link
                      to={`/product/${item._id}`}
                      className="w-[88px] h-[108px] sm:w-28 sm:h-32 rounded-lg sm:rounded-xl overflow-hidden bg-slate-100 flex-shrink-0"
                    >
                      <img
                        className="w-full h-full object-cover"
                        src={image}
                        alt={productData.name || 'Product'}
                      />
                    </Link>

                    <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                      <h3 className="text-sm sm:text-lg font-semibold text-[#0F172A] leading-snug break-words">
                        {productData.name}
                      </h3>

                      <p className="text-[#F97316] font-semibold text-sm sm:text-base mt-2">
                        {currency}{productData.price}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="text-xs sm:text-sm text-slate-500">
                          Size:
                        </span>

                        <span className="px-2.5 py-1 border border-slate-200 bg-slate-50 rounded-md text-xs sm:text-sm font-medium text-[#0F172A]">
                          {item.size}
                        </span>
                      </div>

                      {/* Mobile subtotal */}
                      <div className="sm:hidden mt-3">
                        <span className="text-xs text-slate-500">
                          Subtotal
                        </span>
                        <p className="font-semibold text-sm text-[#0F172A]">
                          {currency}{subtotal}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center text-lg font-semibold text-[#0F172A] hover:bg-[#F97316] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        −
                      </button>

                      <span className="w-9 text-center text-sm font-semibold text-[#0F172A]">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          updateQuantity(
                            item._id,
                            item.size,
                            item.quantity + 1
                          )
                        }
                        className="w-10 h-10 flex items-center justify-center text-lg font-semibold text-[#0F172A] hover:bg-[#F97316] hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="hidden sm:block text-xs text-slate-500">
                        Qty: {item.quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Remove product"
                        onClick={() =>
                          updateQuantity(item._id, item.size, 0)
                        }
                        className="inline-flex items-center justify-center gap-2 min-h-10 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <img
                          src={assets.bin_icon}
                          alt=""
                          className="w-4 h-4 object-contain"
                        />
                        <span className="text-xs sm:text-sm font-medium">
                          Remove
                        </span>
                      </button>
                    </div>

                    {/* Desktop subtotal */}
                    <div className="hidden sm:block text-right ml-auto">
                      <p className="text-xs text-slate-400 mb-1">
                        Subtotal
                      </p>
                      <p className="font-semibold text-[#0F172A]">
                        {currency}{subtotal}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Cart Bottom */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 sm:gap-8 mt-7 sm:mt-10">
            <Link
              to="/collection"
              className="inline-flex self-start items-center gap-2 text-sm sm:text-base text-[#0F172A] font-medium hover:text-[#F97316] transition-colors"
            >
              <span className="text-xl">←</span>
              Continue Shopping
            </Link>

            {/* Cart Total */}
            <div className="w-full min-w-0 lg:w-[450px] bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
              <CartTotal />

              <button
                type="button"
                onClick={() => navigate('/place-order')}
                className="w-full mt-5 min-h-12 px-3 bg-[#0F172A] text-white text-sm sm:text-base rounded-lg font-semibold hover:bg-[#F97316] transition-colors duration-300 shadow-md"
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
