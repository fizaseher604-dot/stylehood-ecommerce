
import { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Collection = () => {
  const { products, productsLoading, search } = useContext(ShopContext)

  const [showFilter, setShowFilter] = useState(false)
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [sortType, setSortType] = useState('relevant')
  const [activeTab, setActiveTab] = useState('all')

  // Category filter
  const toggleCategory = (value) => {
    if (category.includes(value)) {
      setCategory(prev => prev.filter(item => item !== value))
    } else {
      setCategory(prev => [...prev, value])
    }
  }

  // Sub category filter
  const toggleSubCategory = (value) => {
    if (subCategory.includes(value)) {
      setSubCategory(prev => prev.filter(item => item !== value))
    } else {
      setSubCategory(prev => [...prev, value])
    }
  }

  // Top category tabs
  const changeTab = (tab) => {
    setActiveTab(tab)

    if (tab === 'all') {
      setCategory([])
      setSubCategory([])
    }

    if (tab === 'men') {
      setCategory(['Men'])
      setSubCategory([])
    }

    if (tab === 'women') {
      setCategory(['Women'])
      setSubCategory([])
    }

    if (tab === 'kids') {
      setCategory(['Kids'])
      setSubCategory([])
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setCategory([])
    setSubCategory([])
    setActiveTab('all')
    setSortType('relevant')
  }

  // Apply filters and sorting
  const filterProducts = useMemo(() => {
    let productsCopy = [...(products || [])]

    // Search
    const searchTerm = (search || '').trim().toLowerCase()

    if (searchTerm) {
      productsCopy = productsCopy.filter(item =>
        (item.name || '').toLowerCase().includes(searchTerm)
      )
    }

    // Category
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item =>
        category.includes(item.category)
      )
    }

    // Sub category
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item =>
        subCategory.includes(item.subCategory)
      )
    }

    // Sorting
    if (sortType === 'low-high') {
      productsCopy.sort(
        (a, b) => Number(a.price) - Number(b.price)
      )
    } else if (sortType === 'high-low') {
      productsCopy.sort(
        (a, b) => Number(b.price) - Number(a.price)
      )
    } else if (sortType === 'bestseller') {
      productsCopy.sort(
        (a, b) => Number(b.bestseller) - Number(a.bestseller)
      )
    } else if (sortType === 'newest') {
      productsCopy.reverse()
    }

    return productsCopy
  }, [products, search, category, subCategory, sortType])

  const activeFilterCount = category.length + subCategory.length

  return (
    <div className='px-4 sm:px-8 lg:px-12 xl:px-16 py-8'>

      {/* Heading */}
      <div className='text-center max-w-2xl mx-auto mb-10'>
        <p className='text-[#F97316] text-[11px] tracking-[5px] font-semibold mb-3'>
          STYLEHOOD
        </p>

        <Title text1='OUR' text2='COLLECTION' />

        <p className='text-[#64748B] text-sm mt-4 leading-6'>
          Discover pieces designed for your everyday style.
        </p>
      </div>

      {/* Category Tabs */}
      <div className='flex justify-center mb-9'>
        <div className='flex items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-full p-1 overflow-x-auto max-w-full'>

          {['all', 'men', 'women', 'kids'].map(tab => (
            <button
              key={tab}
              onClick={() => changeTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-[#0F172A] text-white shadow-md'
                  : 'text-[#64748B] hover:text-[#F97316]'
              }`}
            >
              {tab === 'all'
                ? 'All'
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

        </div>
      </div>

      {/* Filter + Sort */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7'>

        <button
          onClick={() => setShowFilter(!showFilter)}
          className='flex items-center gap-2 px-5 py-2.5 border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#0F172A] hover:border-[#F97316] hover:text-[#F97316] transition-all duration-300'
        >
          <span>{showFilter ? 'Hide Filters' : 'Show Filters'}</span>
          <span className='text-xs'>{showFilter ? '▲' : '▼'}</span>
        </button>

        <div className='flex items-center gap-4 w-full sm:w-auto'>
          <p className='text-sm text-[#64748B]'>
            {filterProducts.length} Products
          </p>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className='border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#F97316] cursor-pointer bg-white'
          >
            <option value='relevant'>Sort: Relevant</option>
            <option value='newest'>Newest</option>
            <option value='low-high'>Price: Low to High</option>
            <option value='high-low'>Price: High to Low</option>
            <option value='bestseller'>Best Sellers</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      {showFilter && (
        <div className='mb-8 border-y border-[#E2E8F0] py-6'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>

            {/* Category */}
            <div>
              <p className='text-sm font-semibold text-[#0F172A] mb-4'>
                Category
              </p>

              <div className='flex flex-wrap gap-2'>
                {['Men', 'Women', 'Kids'].map(item => (
                  <button
                    key={item}
                    onClick={() => toggleCategory(item)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all duration-300 ${
                      category.includes(item)
                        ? 'bg-[#0F172A] border-[#0F172A] text-white'
                        : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#F97316] hover:text-[#F97316]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub Category */}
            <div>
              <p className='text-sm font-semibold text-[#0F172A] mb-4'>
                Type
              </p>

              <div className='flex flex-wrap gap-2'>
                {['Topwear', 'Bottomwear', 'Winterwear'].map(item => (
                  <button
                    key={item}
                    onClick={() => toggleSubCategory(item)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-all duration-300 ${
                      subCategory.includes(item)
                        ? 'bg-[#0F172A] border-[#0F172A] text-white'
                        : 'bg-white border-[#E2E8F0] text-[#64748B] hover:border-[#F97316] hover:text-[#F97316]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <div className='flex flex-wrap items-center gap-2 mb-7'>
          <span className='text-sm text-[#64748B] mr-1'>Active:</span>

          {category.map(item => (
            <button
              key={item}
              onClick={() => toggleCategory(item)}
              className='flex items-center gap-2 bg-orange-50 text-[#F97316] px-3 py-1.5 rounded-full text-xs font-medium'
            >
              {item}
              <span>×</span>
            </button>
          ))}

          {subCategory.map(item => (
            <button
              key={item}
              onClick={() => toggleSubCategory(item)}
              className='flex items-center gap-2 bg-orange-50 text-[#F97316] px-3 py-1.5 rounded-full text-xs font-medium'
            >
              {item}
              <span>×</span>
            </button>
          ))}

          <button
            onClick={clearFilters}
            className='text-xs text-[#64748B] underline ml-2 hover:text-[#F97316] transition-colors'
          >
            Clear All
          </button>
        </div>
      )}

      {/* Products */}
           {/* Products */}
      {productsLoading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-[#F97316] rounded-full animate-spin"></div>

          <h3 className="text-lg font-semibold text-[#0F172A] mt-5">
            Loading Collection...
          </h3>

          <p className="text-sm text-[#64748B] mt-2">
            Please wait while we load your products.
          </p>
        </div>
      ) : filterProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-10">
            {filterProducts.map((item, index) => (
              <ProductItem
                key={item._id || index}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.Image}
              />
            ))}
          </div>

          <div className="text-center mt-14">
            <p className="text-sm text-[#64748B]">
              Showing {filterProducts.length} of {(products || []).length} products
            </p>
          </div>
        </>
      ) : (
        <div className="min-h-[300px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center mb-5 text-2xl">
            🔍
          </div>

          <h3 className="text-lg font-semibold text-[#0F172A]">
            No Products Found
          </h3>

          <p className="text-sm text-[#64748B] mt-2 max-w-sm">
            Try changing your search or filters to find something you like.
          </p>

          <button
            onClick={clearFilters}
            className="mt-5 px-5 py-2.5 bg-[#0F172A] text-white text-sm rounded-lg hover:bg-[#F97316] transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  )
}

export default Collection
