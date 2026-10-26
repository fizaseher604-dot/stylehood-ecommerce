
import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState('')
  const [desciption, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('10')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestseller, setBestSeller] = useState(false)
  const [sizes, setSizes] = useState([])

  const imageStates = [
    { image: image1, setImage: setImage1, id: 'image1' },
    { image: image2, setImage: setImage2, id: 'image2' },
    { image: image3, setImage: setImage3, id: 'image3' },
    { image: image4, setImage: setImage4, id: 'image4' },
  ]

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    )
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    if (!name.trim() || !desciption.trim() || price === '') {
      toast.error('Please fill in all required fields')
      return
    }

    if (!Number.isFinite(Number(price)) || Number(price) < 0) {
      toast.error('Please enter a valid price')
      return
    }

    if (
      stock === '' ||
      !Number.isInteger(Number(stock)) ||
      Number(stock) < 0
    ) {
      toast.error('Stock must be a whole number of 0 or more')
      return
    }

    if (![image1, image2, image3, image4].some(Boolean)) {
      toast.error('Please upload at least one product image')
      return
    }

    if (sizes.length === 0) {
      toast.error('Please select at least one size')
      return
    }

    setIsSubmitting(true)
    const loadingToast = toast.loading('Uploading product...')

    try {
      const formData = new FormData()

      formData.append('name', name.trim())
      formData.append('description', desciption.trim())
      formData.append('price', price)
      formData.append('stock', stock)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', String(bestseller))
      formData.append('sizes', JSON.stringify(sizes))

      if (image1) formData.append('image1', image1)
      if (image2) formData.append('image2', image2)
      if (image3) formData.append('image3', image3)
      if (image4) formData.append('image4', image4)

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        { headers: { token } }
      )

      if (response.data.success) {
        toast.update(loadingToast, {
          render: response.data.message || 'Product added successfully!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        })

        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setStock('10')
        setCategory('Men')
        setSubCategory('Topwear')
        setSizes([])
        setBestSeller(false)

        e.target.reset()
      } else {
        toast.update(loadingToast, {
          render: response.data.message || 'Unable to add product',
          type: 'error',
          isLoading: false,
          autoClose: 4000,
          closeButton: true,
        })
      }
    } catch (error) {
      console.error('Add Product Error:', error)

      toast.update(loadingToast, {
        render:
          error.response?.data?.message ||
          'Product upload failed. Please try again.',
        type: 'error',
        isLoading: false,
        autoClose: 4000,
        closeButton: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto pt-6 pb-10 px-4 text-[#0F172A] bg-[#F5F6F8]">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            STYLEHOOD / INVENTORY
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold mt-2">
            Add New Product
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Add product details, images and inventory quantity.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-full px-4 py-2 w-fit">
          <span className="w-2 h-2 rounded-full bg-[#F97316]" />
          New Product
        </div>
      </div>

      <form
        className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6"
        onSubmit={onSubmitHandler}
      >
        <div className="flex flex-col gap-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="font-semibold">Product Information</h2>
              <p className="text-xs text-slate-500 mt-1">
                Basic details about your product
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="e.g. Premium Cotton Shirt"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Description
                </label>
                <textarea
                  value={desciption}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe fabric, style and product details..."
                  required
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100"
                />
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <h2 className="font-semibold mb-2">Product Gallery</h2>
            <p className="text-xs text-slate-500 mb-5">
              Upload up to four product images
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {imageStates.map((item, index) => (
                <label
                  key={item.id}
                  htmlFor={item.id}
                  className={`flex flex-col items-center justify-center h-36 rounded-xl border border-dashed cursor-pointer overflow-hidden ${
                    item.image
                      ? 'border-[#F97316] bg-orange-50'
                      : 'border-slate-300 bg-[#F5F6F8] hover:bg-orange-50 hover:border-[#F97316]'
                  }`}
                >
                  {item.image ? (
                    <img
                      src={URL.createObjectURL(item.image)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <img
                        src={assets.upload_area}
                        alt="Upload"
                        className="w-10 h-10 object-contain opacity-70 mb-2"
                      />
                      <span className="text-xs font-medium text-slate-500">
                        Image {index + 1}
                      </span>
                    </>
                  )}

                  <input
                    id={item.id}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        item.setImage(e.target.files[0])
                      }
                    }}
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold mb-5">Pricing & Category</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price (PKR)
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-[#F97316]">
                  <span className="px-3 py-3 bg-[#F5F6F8] border-r border-slate-200 text-sm text-slate-500">
                    Rs.
                  </span>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="2500"
                    required
                    className="w-full px-3 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Initial Stock Quantity
                </label>
                <input
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  type="number"
                  min="0"
                  step="1"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F97316]"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Enter how many units are available.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm bg-white outline-none focus:border-[#F97316]"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Subcategory
                </label>
                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm bg-white outline-none focus:border-[#F97316]"
                >
                  <option value="Topwear">Topwear</option>
                  <option value="Bottomwear">Bottomwear</option>
                  <option value="Winterwear">Winterwear</option>
                </select>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold mb-5">Available Sizes</h2>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`min-w-11 h-10 px-3 rounded-lg border text-sm font-medium transition ${
                    sizes.includes(size)
                      ? 'bg-[#F97316] border-[#F97316] text-white'
                      : 'bg-[#F5F6F8] border-slate-200 text-slate-600 hover:border-[#F97316]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {sizes.length === 0 && (
              <p className="text-xs text-slate-400 mt-3">
                Select at least one size.
              </p>
            )}
          </section>

          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold mb-4">Product Visibility</h2>
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Mark as Bestseller
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Feature this product in your store
                </p>
              </div>
              <input
                checked={bestseller}
                onChange={(e) => setBestSeller(e.target.checked)}
                type="checkbox"
                className="w-5 h-5 accent-[#F97316] cursor-pointer"
              />
            </label>
          </section>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-3 bg-[#0F172A] text-white font-semibold text-sm rounded-xl py-4 transition duration-200 shadow-sm ${
              isSubmitting
                ? 'opacity-80 cursor-not-allowed'
                : 'hover:bg-[#F97316]'
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                UPLOADING PRODUCT...
              </>
            ) : (
              'ADD PRODUCT'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add
