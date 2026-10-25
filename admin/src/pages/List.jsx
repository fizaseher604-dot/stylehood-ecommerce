import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const List = ({ token }) => {
  const [list, setList] = useState([])

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list')

      if (response.data.success) {
        setList(response.data.products)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error.response?.data || error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this product?')) return

    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        {
          headers: {
            token: token
          }
        }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        fetchList()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error.response?.data || error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto pt-6 pb-10 px-4 text-[#0F172A] bg-[#F5F6F8]">

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            STYLEHOOD / INVENTORY
          </p>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0F172A] mt-2">
            Product Collection
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your store products and inventory.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-full px-4 py-2 w-fit">
          <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
          {list.length} Products
        </div>
      </div>

      <section className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">

        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="font-semibold text-[#0F172A]">
              All Products
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Your complete product collection
            </p>
          </div>

          <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-[80px_2fr_1fr_1fr_70px] items-center gap-4 px-4 py-3 bg-[#F5F6F8] border border-slate-200 rounded-xl text-xs font-semibold text-slate-600">
          <p>IMAGE</p>
          <p>PRODUCT NAME</p>
          <p>CATEGORY</p>
          <p>PRICE</p>
          <p className="text-center">ACTION</p>
        </div>

        <div className="flex flex-col gap-3 mt-3">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 border border-dashed border-slate-200 rounded-xl">
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-3">
                <svg className="w-7 h-7 text-[#F97316]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>

              <p className="text-sm font-semibold text-[#0F172A]">
                No products found
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Add a product to see it here.
              </p>
            </div>
          ) : (
            list.map((item, index) => (
              <div
                key={item._id || index}
                className="grid grid-cols-[60px_minmax(0,1fr)_auto] md:grid-cols-[80px_2fr_1fr_1fr_70px] items-center gap-3 sm:gap-4 p-3 sm:px-4 sm:py-3 border border-slate-200 rounded-xl bg-white hover:border-[#F97316]/40 hover:bg-orange-50/30 transition duration-200"
              >

                <div className="w-14 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden border border-slate-100 bg-[#F5F6F8]">
                  <img
                    className="w-full h-full object-cover"
                    src={Array.isArray(item.Image) ? item.Image[0] : item.Image}
                    alt={item.name || 'Product'}
                    onError={(e) => {
                      e.currentTarget.style.visibility = 'hidden'
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#0F172A] truncate">
                    {item.name}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Product #{index + 1}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 md:hidden">
                    <span className="text-[10px] font-medium text-[#F97316] bg-orange-50 border border-orange-100 rounded-md px-2 py-1">
                      {item.category}
                    </span>

                    <span className="text-xs font-semibold text-[#0F172A]">
                      {currency}{item.price}
                    </span>
                  </div>
                </div>

                <div className="hidden md:block">
                  <span className="inline-flex text-xs font-medium text-[#F97316] bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                    {item.category}
                  </span>
                </div>

                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-[#0F172A]">
                    {currency}{item.price}
                  </p>
                </div>

                <div className="flex justify-end md:justify-center">
                  <button
                    type="button"
                    onClick={() => removeProduct(item._id)}
                    title="Remove product"
                    aria-label={`Remove ${item.name}`}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            ))
          )}
        </div>

        {list.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-5 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Showing{' '}
              <span className="font-semibold text-[#0F172A]">
                {list.length}
              </span>{' '}
              products
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