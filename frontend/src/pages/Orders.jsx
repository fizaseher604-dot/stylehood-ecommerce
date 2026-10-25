import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = () => {
  const { backendUrl, token, currency, navigate } = useContext(ShopContext)

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedOrder, setExpandedOrder] = useState(null)

  const loadOrderData = async () => {
    try {
      setLoading(true)

      if (!token) {
        setOrders([])
        return
      }

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      )

      if (response.data.success) {
        const allOrders = Array.isArray(response.data.orders)
          ? response.data.orders
          : []

        const sortedOrders = [...allOrders].sort(
          (a, b) => getTimestamp(b.date) - getTimestamp(a.date)
        )

        setOrders(sortedOrders)
      } else {
        setOrders([])
        toast.error(response.data.message || 'Unable to load orders')
      }
    } catch (error) {
      console.error('Load orders error:', error)
      setOrders([])
      toast.error(
        error.response?.data?.message || 'Unable to load your orders'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token, backendUrl])

  const getTimestamp = (date) => {
    if (!date) return 0

    if (typeof date === 'number') {
      return date < 1e12 ? date * 1000 : date
    }

    if (typeof date === 'string' && /^\d+$/.test(date)) {
      const number = Number(date)
      return number < 1e12 ? number * 1000 : number
    }

    const timestamp = new Date(date).getTime()
    return Number.isNaN(timestamp) ? 0 : timestamp
  }

  const formatDate = (date) => {
    const timestamp = getTimestamp(date)

    if (!timestamp) return 'Date unavailable'

    return new Date(timestamp).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getImage = (item) => {
    const image = item.image ?? item.Image

    if (Array.isArray(image)) return image[0] || ''
    if (typeof image === 'string') return image

    return ''
  }

  const getStatus = (status) => {
    const value = String(status || 'Order Placed')
      .trim()
      .toLowerCase()

    if (value.includes('cancel') || value.includes('reject')) {
      return {
        label: 'Cancelled',
        style: 'bg-red-50 text-red-700 border-red-200',
        dot: 'bg-red-500',
        step: -1,
      }
    }

    if (value.includes('deliver')) {
      return {
        label: 'Delivered',
        style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        step: 3,
      }
    }

    if (value.includes('out for')) {
      return {
        label: 'Out for Delivery',
        style: 'bg-violet-50 text-violet-700 border-violet-200',
        dot: 'bg-violet-500',
        step: 2,
      }
    }

    if (value.includes('ship') || value.includes('dispatch')) {
      return {
        label: 'Shipped',
        style: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        step: 2,
      }
    }

    if (
      value.includes('process') ||
      value.includes('pack') ||
      value.includes('ready')
    ) {
      return {
        label: 'Processing',
        style: 'bg-amber-50 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        step: 1,
      }
    }

    return {
      label: 'Order Placed',
      style: 'bg-orange-50 text-orange-700 border-orange-200',
      dot: 'bg-orange-500',
      step: 0,
    }
  }

  const getPaymentMethod = (method) => {
    const value = String(method || '').toLowerCase()

    if (value === 'cod' || value.includes('cash on delivery')) {
      return 'Cash on Delivery'
    }

    if (
      value === 'stripe' ||
      value.includes('online') ||
      value === 'razorpay'
    ) {
      return 'Online Payment'
    }

    return method || 'Not specified'
  }

  const getOrderId = (order) => {
    const id = order._id || order.id
    return id ? String(id).slice(-8).toUpperCase() : 'N/A'
  }

  const getOrderTotal = (order) => {
    if (order.amount !== undefined && order.amount !== null) {
      return Number(order.amount) || 0
    }

    return order.items.reduce((total, item) => {
      const price = Number(item.price ?? item.Price) || 0
      const quantity = Number(item.quantity ?? item.qty) || 1
      return total + price * quantity
    }, 0)
  }

  const getOrderItems = (order) => {
    return Array.isArray(order.items) ? order.items : []
  }

  const totalItems = orders.reduce(
    (total, order) => total + getOrderItems(order).length,
    0
  )

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-[#F8FAFC]">
        <div className="w-11 h-11 border-[3px] border-slate-200 border-t-[#F97316] rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-500">
          Loading your orders...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] p-6 sm:p-9 mb-8">
          <div className="absolute -right-12 -top-16 w-56 h-56 rounded-full border-[28px] border-white/[0.04]" />

          <div className="absolute right-12 bottom-0 w-36 h-36 bg-[#F97316]/15 rounded-full blur-3xl" />

          <div className="absolute left-0 top-0 h-full w-1 bg-[#F97316]" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-[2px] bg-[#F97316]" />
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#F97316] uppercase">
                STYLEHOOD / ACCOUNT
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              My Orders<span className="text-[#F97316]">.</span>
            </h1>

            <p className="text-slate-400 text-sm mt-3 max-w-md leading-6">
              View your purchases and track your order delivery in one place.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <div className="min-w-32 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {orders.length}
                </p>
              </div>

              <div className="min-w-32 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {totalItems}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Heading */}
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[#F97316] uppercase mb-1.5">
              PURCHASE HISTORY
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Your Orders
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Select Track Order to view delivery progress.
            </p>
          </div>

          <button
            type="button"
            onClick={loadOrderData}
            className="shrink-0 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:border-[#F97316] hover:text-[#F97316] transition"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M20 7v5h-5" />
              <path d="M4 17v-5h5" />
              <path d="M5.6 9a7 7 0 0 1 11.8-2L20 12" />
              <path d="M18.4 15a7 7 0 0 1-11.8 2L4 12" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, orderIndex) => {
              const orderItems = getOrderItems(order)
              const status = getStatus(order.status || order.orderStatus)
              const orderKey = String(order._id || order.id || orderIndex)
              const isTracking = expandedOrder === orderKey

              return (
                <article
                  key={orderKey}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-slate-100">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-slate-400">
                        Order ID
                      </p>
                      <p className="text-sm font-bold mt-1">
                        #{getOrderId(order)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Placed on {formatDate(order.date)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${status.style}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrder(isTracking ? null : orderKey)
                        }
                        aria-expanded={isTracking}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                          isTracking
                            ? 'bg-orange-50 text-[#F97316] border border-orange-200'
                            : 'bg-[#0F172A] text-white hover:bg-[#F97316]'
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M3 7h11v11H3z" />
                          <path d="M14 11h4l3 3v4h-7z" />
                          <circle cx="7.5" cy="18" r="1.5" />
                          <circle cx="17.5" cy="18" r="1.5" />
                        </svg>

                        {isTracking ? 'Hide Tracking' : 'Track Order'}

                        <svg
                          className={`w-3.5 h-3.5 transition-transform ${isTracking ? 'rotate-180' : ''}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Product List */}
                  <div className="p-4 sm:p-6">
                    <div className="space-y-5">
                      {orderItems.map((item, itemIndex) => {
                        const image = getImage(item)
                        const name = item.name || item.Name || 'Product'
                        const price = Number(item.price ?? item.Price) || 0
                        const quantity =
                          Number(item.quantity ?? item.qty) || 1

                        return (
                          <div
                            key={`${orderKey}-${itemIndex}`}
                            className="flex gap-4"
                          >
                            <div className="w-24 h-28 sm:w-28 sm:h-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                              {image ? (
                                <img
                                  src={image}
                                  alt={name}
                                  className="w-full h-full object-cover"
                                  onError={(event) => {
                                    event.currentTarget.style.display = 'none'
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <svg
                                    className="w-8 h-8"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                  >
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                    <path d="m21 15-5-5L5 21" />
                                  </svg>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#F97316]">
                                  {item.category || item.Category || 'STYLEHOOD'}
                                </p>

                                <h3 className="text-sm sm:text-base font-bold mt-1 break-words">
                                  {name}
                                </h3>

                                <div className="flex flex-wrap gap-2 mt-2">
                                  <span className="text-xs text-slate-500 bg-slate-100 rounded-md px-2.5 py-1.5">
                                    Size: <strong className="text-slate-800">{item.size || item.Size || 'N/A'}</strong>
                                  </span>

                                  <span className="text-xs text-slate-500 bg-slate-100 rounded-md px-2.5 py-1.5">
                                    Qty: <strong className="text-slate-800">{quantity}</strong>
                                  </span>
                                </div>
                              </div>

                              <p className="text-base font-bold mt-3">
                                <span className="text-xs text-[#F97316] mr-1">
                                  {currency}
                                </span>
                                {(price * quantity).toLocaleString('en-PK')}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Expandable Tracking */}
                    {isTracking && (
                      <div className="mt-6 rounded-xl border border-slate-200 overflow-hidden">
                        <div className="bg-[#0F172A] px-4 sm:px-5 py-4 flex items-center justify-between gap-3">
                          <div>
                            <p className="text-white font-bold text-sm sm:text-base">
                              Delivery Tracking
                            </p>
                            <p className="text-slate-400 text-xs mt-1">
                              Order #{getOrderId(order)}
                            </p>
                          </div>

                          <span className="text-[#F97316] text-xs font-semibold">
                            {status.label}
                          </span>
                        </div>

                        <div className="p-4 sm:p-6">
                          {status.step === -1 ? (
                            <div className="flex items-start gap-3 rounded-lg border border-red-100 bg-red-50 p-4">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                                !
                              </span>
                              <div>
                                <p className="text-sm font-bold text-red-700">
                                  Order Cancelled
                                </p>
                                <p className="text-xs text-red-600 mt-1">
                                  This order is marked as cancelled.
                                </p>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start">
                                {[
                                  { title: 'Order Placed', description: 'Order received' },
                                  { title: 'Processing', description: 'Being prepared' },
                                  { title: 'Shipped', description: 'On its way' },
                                  { title: 'Delivered', description: 'Order received' },
                                ].map((step, index) => {
                                  const active = index <= status.step

                                  return (
                                    <React.Fragment key={step.title}>
                                      <div className="w-[22%] flex flex-col items-center text-center">
                                        <div
                                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                                            active
                                              ? 'bg-[#F97316] text-white'
                                              : 'bg-slate-100 text-slate-400 border border-slate-200'
                                          }`}
                                        >
                                          {active ? '✓' : index + 1}
                                        </div>

                                        <p
                                          className={`mt-2 text-[10px] sm:text-xs font-semibold ${
                                            active ? 'text-[#0F172A]' : 'text-slate-400'
                                          }`}
                                        >
                                          {step.title}
                                        </p>

                                        <p className="hidden sm:block text-[10px] text-slate-400 mt-1">
                                          {step.description}
                                        </p>
                                      </div>

                                      {index < 3 && (
                                        <div
                                          className={`flex-1 h-[2px] mt-4 sm:mt-[18px] ${
                                            index < status.step
                                              ? 'bg-[#F97316]'
                                              : 'bg-slate-200'
                                          }`}
                                        />
                                      )}
                                    </React.Fragment>
                                  )
                                })}
                              </div>

                              <div className="mt-6 rounded-lg bg-orange-50 border border-orange-100 p-3 sm:p-4">
                                <p className="text-sm font-semibold text-[#0F172A]">
                                  Current Status: {status.label}
                                </p>
                                <p className="text-xs text-slate-600 mt-1 leading-5">
                                  This status reflects the information currently saved for your order.
                                </p>
                              </div>
                            </>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                Payment Method
                              </p>
                              <p className="text-sm font-semibold mt-1">
                                {getPaymentMethod(
                                  order.paymentMethod || order.paymentMethodName
                                )}
                              </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
                              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                                Order Date
                              </p>
                              <p className="text-sm font-semibold mt-1">
                                {formatDate(order.date)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Footer */}
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                          {orderItems.length} {orderItems.length === 1 ? 'Product' : 'Products'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {getPaymentMethod(order.paymentMethod)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                          Order Total
                        </p>
                        <p className="text-lg sm:text-xl font-bold mt-1">
                          <span className="text-xs text-[#F97316] mr-1">
                            {currency}
                          </span>
                          {getOrderTotal(order).toLocaleString('en-PK')}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden text-center px-5 py-14 sm:py-16">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#0F172A] flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[#F97316]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M6 7h12l1 14H5L6 7Z" />
                <path d="M9 9V6a3 3 0 0 1 6 0v3" />
              </svg>
            </div>

            <h3 className="text-xl font-bold mt-5">No Orders Yet</h3>

            <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-6">
              Your orders will appear here after you complete your first purchase.
            </p>

            <button
              type="button"
              onClick={() => navigate('/collection')}
              className="mt-6 inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors"
            >
              Explore Collection <span>→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders