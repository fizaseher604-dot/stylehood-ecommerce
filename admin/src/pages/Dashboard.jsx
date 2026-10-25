
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { backendUrl, currency } from '../App'

const Dashboard = ({ token }) => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true)

      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.post(
            `${backendUrl}/api/order/list`,
            {},
            { headers: { token } }
          ),
          axios.get(`${backendUrl}/api/product/list`)
        ])

        if (ordersRes.data.success) {
          setOrders(
            Array.isArray(ordersRes.data.orders)
              ? ordersRes.data.orders
              : []
          )
        }

        if (productsRes.data.success) {
          setProducts(
            Array.isArray(productsRes.data.products)
              ? productsRes.data.products
              : []
          )
        }
      } catch (error) {
        console.error('Dashboard loading error:', error)
      } finally {
        setLoading(false)
      }
    }

    if (token) fetchDashboard()
  }, [token])

  const totalSales = orders.reduce(
    (total, order) => total + (Number(order.amount) || 0),
    0
  )

  const deliveredOrders = orders.filter(
    order => order.status === 'Delivered'
  ).length

  const pendingOrders = orders.filter(
    order => order.status === 'Order Placed'
  ).length

  const stats = [
    {
      title: 'Total Sales',
      value: `${currency} ${totalSales.toLocaleString()}`,
      icon: '₨',
      color: 'bg-orange-50 text-orange-600',
      description: 'Value of all recorded orders'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      icon: '▤',
      color: 'bg-blue-50 text-blue-600',
      description: 'All customer orders'
    },
    {
      title: 'Total Products',
      value: products.length,
      icon: '□',
      color: 'bg-purple-50 text-purple-600',
      description: 'Products in your store'
    },
    {
      title: 'Delivered Orders',
      value: deliveredOrders,
      icon: '✓',
      color: 'bg-green-50 text-green-600',
      description: `${pendingOrders} orders currently awaiting processing`
    }
  ]

  const recentOrders = [...orders]
    .sort((a, b) => Number(b.date || 0) - Number(a.date || 0))
    .slice(0, 5)

  const formatDate = (date) => {
    if (!date) return 'Date unavailable'

    const parsedDate = new Date(Number(date))

    const validDate = Number.isNaN(parsedDate.getTime())
      ? new Date(date)
      : parsedDate

    if (Number.isNaN(validDate.getTime())) return 'Date unavailable'

    return validDate.toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen space-y-7 bg-[#F8FAFC] p-4 text-[#0F172A] sm:p-6 lg:p-8">

      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-orange-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-[#F97316]">
              STYLEHOOD ADMIN
            </p>

            <h1 className="text-2xl font-bold sm:text-3xl">
              Dashboard Overview
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Welcome back! Manage your store and track your business.
            </p>
          </div>

          <Link
            to="/add"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-[#F97316] px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            <span className="text-lg">+</span>
            Add New Product
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Store Performance</h2>
            <p className="mt-1 text-sm text-slate-500">
              A quick overview of your store
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <h3 className="mt-3 break-words text-2xl font-bold text-[#0F172A]">
                    {loading ? '...' : stat.value}
                  </h3>
                </div>

                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl font-bold ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest customer orders and their status
            </p>
          </div>

          <Link
            to="/orders"
            className="text-sm font-bold text-[#F97316] transition hover:text-orange-700"
          >
            View All Orders →
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading dashboard...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-2xl text-[#F97316]">
              ▤
            </div>

            <h3 className="font-bold text-[#0F172A]">
              No orders yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Customer orders will appear here when available.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentOrders.map((order, index) => (
              <div
                key={order._id || index}
                className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 font-bold text-[#F97316]">
                    #{index + 1}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#0F172A]">
                      {order.address?.firstName || 'Customer'}{' '}
                      {order.address?.lastName || ''}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(order.date)} ·{' '}
                      {order.items?.length || 0} item(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <span className="text-sm font-bold text-[#0F172A]">
                    {currency} {Number(order.amount || 0).toLocaleString()}
                  </span>

                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    order.status === 'Delivered'
                      ? 'bg-green-50 text-green-700'
                      : order.status === 'Cancelled'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-orange-50 text-orange-700'
                  }`}>
                    {order.status || 'Order Placed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-bold">Quick Actions</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            to="/add"
            className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-2xl font-bold text-[#F97316] transition group-hover:bg-[#F97316] group-hover:text-white">
              +
            </div>

            <div>
              <h3 className="font-bold">Add Product</h3>
              <p className="mt-1 text-xs text-slate-500">
                Add items to your store
              </p>
            </div>
          </Link>

          <Link
            to="/list"
            className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl font-bold text-[#0F172A] transition group-hover:bg-[#0F172A] group-hover:text-white">
              □
            </div>

            <div>
              <h3 className="font-bold">Manage Products</h3>
              <p className="mt-1 text-xs text-slate-500">
                View and update products
              </p>
            </div>
          </Link>

          <Link
            to="/orders"
            className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-orange-300 hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl font-bold text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
              ▤
            </div>

            <div>
              <h3 className="font-bold">Manage Orders</h3>
              <p className="mt-1 text-xs text-slate-500">
                Check orders and update status
              </p>
            </div>
          </Link>
        </div>
      </div>

    </div>
  )
}

export default Dashboard
