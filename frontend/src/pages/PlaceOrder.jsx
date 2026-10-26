import { useContext, useState, useMemo } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Radio = ({ selected }) => (
  <span
    aria-hidden="true"
    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
      selected ? 'border-[#F97316]' : 'border-gray-400'
    }`}
  >
    {selected && (
      <span className="h-2.5 w-2.5 rounded-full bg-[#F97316]" />
    )}
  </span>
)

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const [loading, setLoading] = useState(false)

  const {
    navigate,
    backendUrl,
    token,
    cartItem,
    setCartItem,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext)

  const buyNowData = useMemo(() => {
    try {
      const saved = sessionStorage.getItem('stylehoodBuyNow')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  }, [])

  const isBuyNow = Boolean(buyNowData)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'Pakistan',
    phone: '',
  })

  const onChangeHandler = (event) => {
    const { name, value } = event.target

    setFormData((data) => ({
      ...data,
      [name]: value,
    }))
  }

  const formatOrderItem = (product, size, quantity) => ({
    ...product,
    size,
    quantity: Number(quantity),
  })

  const getOrderItems = () => {
    if (buyNowData) {
      const productId =
        buyNowData.productId ||
        buyNowData._id ||
        buyNowData.id

      const size = buyNowData.size || buyNowData.selectedSize
      const quantity = Number(buyNowData.quantity || 1)

      const product =
        products.find(
          (item) => String(item._id) === String(productId)
        ) ||
        (buyNowData._id ? buyNowData : null)

      if (
        !product ||
        !size ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return []
      }

      return [formatOrderItem(product, size, quantity)]
    }

    const orderItems = []

    for (const productId in cartItem) {
      for (const size in cartItem[productId]) {
        const quantity = Number(cartItem[productId][size])

        if (quantity > 0) {
          const product = products.find(
            (item) => String(item._id) === String(productId)
          )

          if (product) {
            orderItems.push(
              formatOrderItem(product, size, quantity)
            )
          }
        }
      }
    }

    return orderItems
  }

  const orderItems = getOrderItems()

  const subtotal = orderItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  )

  const totalAmount = subtotal + Number(delivery_fee || 0)

  // Check stock before checkout
  const unavailableItems = orderItems.filter((item) => {
    const product = products.find(
      (product) => String(product._id) === String(item._id)
    )

    const availableStock = Number(product?.stock) || 0
    const requestedQuantity = Number(item.quantity) || 0

    return (
      !product ||
      availableStock <= 0 ||
      requestedQuantity > availableStock
    )
  })

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    if (loading) return

    if (!token) {
      toast.error('Please login before placing your order')
      navigate('/login')
      return
    }

    const items = getOrderItems()

    if (items.length === 0) {
      toast.error(
        isBuyNow
          ? 'Product is loading or its size is missing. Please return to the product page.'
          : 'Your cart is empty or products are still loading'
      )
      return
    }

    // Refresh stock validation using the latest product data available
    const stockProblem = items.find((item) => {
      const product = products.find(
        (p) => String(p._id) === String(item._id)
      )

      return (
        !product ||
        Number(product.stock || 0) <= 0 ||
        Number(item.quantity) > Number(product.stock || 0)
      )
    })

    if (stockProblem) {
      toast.error(
        `${stockProblem.name || 'Product'} is out of stock or the requested quantity is unavailable. Please update your cart.`
      )
      return
    }

    if (method === 'jazzcash' || method === 'easypaisa') {
      toast.info(
        `${method === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} demo selected. Official merchant integration is not connected yet. No payment was made.`
      )
      return
    }

    try {
      setLoading(true)

      const subtotalAmount = items.reduce(
        (total, item) =>
          total + Number(item.price || 0) * Number(item.quantity || 0),
        0
      )

      const orderData = {
        address: formData,
        items,
        amount: subtotalAmount + Number(delivery_fee || 0),
      }

      const response = await axios.post(
        backendUrl + '/api/order/place',
        orderData,
        {
          headers: { token },
        }
      )

      if (response.data.success) {
        if (isBuyNow) {
          sessionStorage.removeItem('stylehoodBuyNow')
        } else {
          setCartItem({})
        }

        toast.success('Order placed successfully!')
        navigate('/orders')
      } else {
        toast.error(
          response.data.message || 'Unable to place order'
        )
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-orange-100'

  const paymentCardClass = (selected) =>
    `flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all ${
      selected
        ? 'border-[#F97316] bg-orange-50 shadow-sm'
        : 'border-gray-200 bg-white hover:border-gray-400'
    }`

  return (
    <form
      onSubmit={onSubmitHandler}
      className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <div className="mb-10">
        <Title text1="PLACE" text2="ORDER" />
        <p className="mt-2 text-sm text-gray-500">
          Complete your details to place your Stylehood order.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Delivery Information
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter the details where you want your order delivered.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} placeholder="First name" className={inputClass} />
            <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} placeholder="Last name" className={inputClass} />
            <input required type="email" name="email" value={formData.email} onChange={onChangeHandler} placeholder="Email address" className={`${inputClass} sm:col-span-2`} />
            <input required name="street" value={formData.street} onChange={onChangeHandler} placeholder="House number and street" className={`${inputClass} sm:col-span-2`} />
            <input required name="city" value={formData.city} onChange={onChangeHandler} placeholder="City" className={inputClass} />
            <input required name="state" value={formData.state} onChange={onChangeHandler} placeholder="Province" className={inputClass} />
            <input required name="zipcode" value={formData.zipcode} onChange={onChangeHandler} placeholder="Postal code" className={inputClass} />
            <input required name="country" value={formData.country} onChange={onChangeHandler} placeholder="Country" className={inputClass} />
            <input required type="tel" name="phone" value={formData.phone} onChange={onChangeHandler} placeholder="Phone number" className={`${inputClass} sm:col-span-2`} />
          </div>
        </div>

        <div className="flex flex-col gap-7">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-5 text-xl font-bold text-[#0F172A]">
              Order Summary
            </h2>

            {isBuyNow ? (
              <div className="space-y-4">
                {orderItems.map((item, index) => (
                  <div key={`${item._id}-${item.size}-${index}`} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <img
                      src={Array.isArray(item.Image) ? item.Image[0] : item.Image || item.image}
                      alt={item.name || item.Name || 'Product'}
                      className="h-20 w-16 rounded-lg bg-gray-100 object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 font-semibold text-[#0F172A]">
                        {item.name || item.Name || 'Stylehood Product'}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Size: {item.size} · Qty: {item.quantity}
                      </p>
                      <p className="mt-1 font-bold text-[#F97316]">
                        Rs. {(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Fee</span>
                  <span>Rs. {Number(delivery_fee || 0).toLocaleString()}</span>
                </div>
              </div>
            ) : (
              <CartTotal />
            )}

            {unavailableItems.length > 0 && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <p className="font-semibold">Stock unavailable</p>
                <p className="mt-1">
                  {unavailableItems.map((item) => item.name || 'Product').join(', ')} — please update your cart or select another product.
                </p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4">
              <span className="font-semibold text-[#0F172A]">
                Total Amount
              </span>
              <span className="text-xl font-bold text-[#F97316]">
                Rs. {(
                  isBuyNow
                    ? totalAmount
                    : Number(getCartAmount() || 0) + Number(delivery_fee || 0)
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#0F172A]">
                Payment Method
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Select your preferred payment option.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button type="button" onClick={() => setMethod('jazzcash')} className={paymentCardClass(method === 'jazzcash')}>
                <Radio selected={method === 'jazzcash'} />
                <div className="flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                  <img src={assets.jazzcash} alt="JazzCash" className="max-h-12 max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#0F172A]">JazzCash</p>
                </div>
              </button>

              <button type="button" onClick={() => setMethod('easypaisa')} className={paymentCardClass(method === 'easypaisa')}>
                <Radio selected={method === 'easypaisa'} />
                <div className="flex h-12 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
                  <img src={assets.easypaisa} alt="Easypaisa" className="max-h-12 max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#0F172A]">Easypaisa</p>
                </div>
              </button>

              <button type="button" onClick={() => setMethod('cod')} className={paymentCardClass(method === 'cod')}>
                <Radio selected={method === 'cod'} />
                <div className="flex h-12 w-24 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                  {assets.cod ? (
                    <img className="h-12 w-24 object-contain" src={assets.cod} alt="Cash on Delivery" />
                  ) : (
                    <span className="text-xs font-bold text-slate-700">CASH</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#0F172A]">Cash on Delivery</p>
                  <p className="mt-1 text-xs text-gray-500">Pay when your order arrives</p>
                </div>
              </button>
            </div>

            {method !== 'cod' && (
              <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">
                <p className="font-bold">Portfolio Demo Mode</p>
                <p className="mt-1">
                  This payment option is for demonstration only. No money will be collected and no payment will be marked as successful.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || orderItems.length === 0 || unavailableItems.length > 0}
              className="mt-6 w-full rounded-xl bg-[#F97316] px-5 py-4 font-bold text-white shadow-md transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'PLEASE WAIT...'
                : unavailableItems.length > 0
                  ? 'STOCK UNAVAILABLE'
                  : method === 'cod'
                    ? 'PLACE ORDER'
                    : 'VIEW DEMO NOTICE'}
            </button>

            <p className="mt-3 text-center text-xs text-gray-500">
              Secure checkout experience for the Stylehood portfolio demo.
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder