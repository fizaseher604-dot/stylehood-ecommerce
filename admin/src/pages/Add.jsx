import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState('')
  const [desciption, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('Men')
  const [subCategory, setSubCategory] = useState('Topwear')
  const [bestseller, setBestSeller] = useState(false)
  const [sizes, setSizes] = useState([])

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      formData.append('name', name)
      formData.append('description', desciption)
      formData.append('price', price)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('bestseller', bestseller)
      formData.append('sizes', JSON.stringify(sizes))

      image1 && formData.append('image1', image1)
      image2 && formData.append('image2', image2)
      image3 && formData.append('image3', image3)
      image4 && formData.append('image4', image4)

      const response = await axios.post(
        backendUrl + '/api/product/add',
        formData,
        {
          headers: {
            token: token,
          },
        }
      )

      console.log('API RESPONSE:', response.data)

      if (response.data.success) {
        toast.success(response.data.message)

        setName('')
        setDescription('')

        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)

        setPrice('')
        setCategory('Men')
        setSubCategory('Topwear')
        setSizes([])
        setBestSeller(false)

        e.target.reset()
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

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

  return (
    <div className="w-full max-w-6xl mx-auto pt-6 pb-10 px-4 text-[#0F172A] bg-[#F5F6F8]">

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            STYLEHOOD / INVENTORY
          </p>

          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0F172A] mt-2">
            Add New Product
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Add product details and upload its images.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-white border border-slate-200 rounded-full px-4 py-2 w-fit">
          <span className="w-2 h-2 rounded-full bg-[#F97316]"></span>
          New Product
        </div>
      </div>

      <form
        className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6"
        onSubmit={onSubmitHandler}
      >
        <div className="flex flex-col gap-6">

          {/* Product Information */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center font-semibold">
                01
              </div>

              <div>
                <h2 className="font-semibold text-[#0F172A]">
                  Product Information
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Basic details about your product
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Name
                </label>

                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  placeholder="e.g. Premium Cotton Shirt"
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Product Description
                </label>

                <textarea
                  onChange={(e) => setDescription(e.target.value)}
                  value={desciption}
                  placeholder="Describe fabric, style, and product details..."
                  required
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-[#F97316] focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>
            </div>
          </section>

          {/* Product Gallery */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center font-semibold">
                02
              </div>

              <div>
                <h2 className="font-semibold text-[#0F172A]">
                  Product Gallery
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload up to four product images
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {imageStates.map((item, index) => (
                <label
                  key={item.id}
                  htmlFor={item.id}
                  className={`relative flex flex-col items-center justify-center h-36 rounded-xl border border-dashed cursor-pointer transition overflow-hidden ${
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
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        item.setImage(e.target.files[0])
                      }
                    }}
                    type="file"
                    id={item.id}
                    accept="image/*"
                    hidden
                  />
                </label>
              ))}
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Recommended: use clear, high-quality product images.
            </p>
          </section>
        </div>

        <div className="flex flex-col gap-6">

          {/* Pricing & Category */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center font-semibold">
                03
              </div>

              <div>
                <h2 className="font-semibold text-[#0F172A]">
                  Pricing & Category
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Organize your product
                </p>
              </div>
            </div>

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
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    type="number"
                    min="0"
                    placeholder="2500"
                    required
                    className="w-full px-3 py-3 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>

                <select
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
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
                  onChange={(e) => setSubCategory(e.target.value)}
                  value={subCategory}
                  className="w-full border border-slate-200 rounded-xl px-3 py-3 text-sm bg-white outline-none focus:border-[#F97316]"
                >
                  <option value="Topwear">Topwear</option>
                  <option value="Bottomwear">Bottomwear</option>
                  <option value="Winterwear">Winterwear</option>
                </select>
              </div>
            </div>
          </section>

          {/* Available Sizes */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center font-semibold">
                04
              </div>

              <div>
                <h2 className="font-semibold text-[#0F172A]">
                  Available Sizes
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select sizes for this product
                </p>
              </div>
            </div>

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
          </section>

          {/* Product Visibility */}
          <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h2 className="font-semibold text-[#0F172A] mb-4">
              Product Visibility
            </h2>

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
                onChange={() => setBestSeller((prev) => !prev)}
                checked={bestseller}
                type="checkbox"
                className="w-5 h-5 accent-[#F97316] cursor-pointer"
              />
            </label>
          </section>

          <button
            type="submit"
            className="w-full bg-[#0F172A] hover:bg-[#F97316] text-white font-semibold text-sm rounded-xl py-4 transition duration-200 shadow-sm"
          >
            ADD PRODUCT
          </button>
        </div>
      </form>
    </div>
  )
}

export default Add