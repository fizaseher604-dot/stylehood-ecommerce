
import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [stockValues, setStockValues] = useState({})
  const [savingStock, setSavingStock] = useState('')

  const fetchList = async () => {
    setLoading(true)

    try {
      const response = await axios.get(
        `${backendUrl}/api/product/list`
      )

      if (response.data.success) {
        const products = response.data.products || []
        setList(products)

        const values = {}
        products.forEach((product) => {
          values[product._id] = String(
            Number.isInteger(Number(product.stock))
              ? product.stock
              : 0
          )
        })

        setStockValues(values)
      } else {
        toast.error(response.data.message || 'Failed to load products')
      }
    } catch (error) {
      console.error(error.response?.data || error)
      toast.error(
        error.response?.data?.message || 'Failed to load products'
      )
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (id) => {
    const value = stockValues[id]

    if (
      value === '' ||
      !Number.isInteger(Number(value)) ||
      Number(value) < 0
    ) {
      toast.error('Stock must be a whole number of 0 or more')
      return
    }

    setSavingStock(id)

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/stock`,
        { id, stock: Number(value) },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message || 'Stock updated successfully')

        setList((previous) =>
          previous.map((product) =>
            product._id === id
              ? { ...product, stock: Number(value) }
              : product
          )
        )
      } else {
        toast.error(response.data.message || 'Unable to update stock')
      }
    } catch (error) {
      console.error(error.response?.data || error)
      toast.error(
        error.response?.data?.message || 'Unable to update stock'
      )
    } finally {
      setSavingStock('')
    }
  }

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) {
      return
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/product/remove`,
        { id },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message || 'Product removed')
        fetchList()
      } else {
        toast.error(response.data.message || 'Unable to remove product')
      }
    } catch (error) {
      console.error(error.response?.data || error)
      toast.error(
        error.response?.data?.message || 'Unable to remove product'
      )
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  const totalStock = list.reduce(
    (total, item) => total + Math.max(0, Number(item.stock) || 0),
    0
  )

  const outOfStockCount = list.filter(
    (item) => Number(item.stock) <= 0
  ).length

  return (
    <div className="w-full max-w-6xl mx-auto pt-6 pb-10 px-4 text-[#0F172A] bg-[#F5F6F8]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            STYLEHOOD / INVENTORY
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold mt-2">
            Product Collection
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage products and available stock quantities.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchList}
          className="text-xs font-semibold bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-[#F97316] transition w-fit"
        >
          Refresh Inventory
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Total Products</p>
          <p className="text-2xl font-semibold mt-2">{list.length}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Total Units in Stock</p>
          <p className="text-2xl font-semibold mt-2">{totalStock}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Out-of-Stock Products</p>
          <p className="text-2xl font-semibold text-red-500 mt-2">
            {outOfStockCount}
          </p>
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-semibold">All Products</h2>
            <p className="text-xs text-slate-500 mt-1">
              Update inventory or remove a product.
            </p>
          </div>

          <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-14 border border-slate-200 rounded-xl">
            <div className="w-9 h-9 border-4 border-orange-100 border-t-[#F97316] rounded-full animate-spin" />
            <p className="text-sm font-semibold mt-4">Loading products...</p>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-14 border border-dashed border-slate-200 rounded-xl">
            <p className="text-sm font-semibold">No products found</p>
            <p className="text-xs text-slate-500 mt-1">
              Add a product to see it here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {list.map((item, index) => {
              const stock = Math.max(0, Number(item.stock) || 0)
              const outOfStock = stock === 0

              return (
                <div
                  key={item._id || index}
                  className="grid grid-cols-[56px_minmax(0,1fr)] md:grid-cols-[72px_minmax(0,1.8fr)_1fr_1.2fr_auto] items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-slate-200 rounded-xl hover:border-orange-200 transition"
                >
                  <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden border border-slate-100 bg-[#F5F6F8]">
                    <img
                      className="w-full h-full object-cover"
                      src={
                        Array.isArray(item.Image)
                          ? item.Image[0]
                          : item.Image
                      }
                      alt={item.name || 'Product'}
                      onError={(e) => {
                        e.currentTarget.style.visibility = 'hidden'
                      }}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.category} · {item.subCategory}
                    </p>
                    <p className="text-sm font-semibold mt-2">
                      {currency}{item.price}
                    </p>
                    <span
                      className={`inline-flex text-[10px] font-semibold rounded-md px-2 py-1 mt-2 ${
                        outOfStock
                          ? 'bg-red-50 text-red-600 border border-red-100'
                          : stock <= 5
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-green-50 text-green-700 border border-green-100'
                      }`}
                    >
                      {outOfStock
                        ? 'OUT OF STOCK'
                        : stock <= 5
                          ? 'LOW STOCK'
                          : 'IN STOCK'}
                    </span>
                  </div>

                  <div className="hidden md:block">
                    <p className="text-xs text-slate-500 mb-2">Current stock</p>
                    <p className="text-lg font-semibold">{stock} units</p>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      Update stock quantity
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={stockValues[item._id] ?? '0'}
                        onChange={(e) =>
                          setStockValues((previous) => ({
                            ...previous,
                            [item._id]: e.target.value,
                          }))
                        }
                        className="w-full min-w-0 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#F97316]"
                      />
                      <button
                        type="button"
                        disabled={savingStock === item._id}
                        onClick={() => updateStock(item._id)}
                        className="shrink-0 bg-[#0F172A] text-white rounded-lg px-3 py-2 text-xs font-semibold hover:bg-[#F97316] disabled:opacity-50 transition"
                      >
                        {savingStock === item._id ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2 md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeProduct(item._id)}
                      title="Remove product"
                      aria-label={`Remove ${item.name}`}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7h16M10 11v6m4-6v6M5 7l1 13h12l1-13M9 7V4h6v3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {!loading && list.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-5 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Showing <span className="font-semibold">{list.length}</span> products
            </p>
            <p className="text-xs text-slate-400">
              STYLEHOOD <span className="text-[#F97316]">●</span> Inventory Management
            </p>
          </div>
        )}
      </section>
    </div>
  )
}

export default List
