import { useContext, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation, Link } from 'react-router-dom'

const SearchBar = () => {

    const {
        products,
        search,
        setSearch,
        showSearch,
        setShowSearch
    } = useContext(ShopContext)

    const location = useLocation()

    useEffect(() => {
        setShowSearch(false)
    }, [location.pathname, setShowSearch])

    // FIX 1: Handle missing products or search values safely
    const productList = Array.isArray(products) ? products : []
    const searchText = typeof search === 'string' ? search : ''

    const filteredProducts = productList.filter(item => {
        const name = typeof item?.name === 'string'
            ? item.name
            : ''

        return name.toLowerCase().includes(searchText.toLowerCase())
    })

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setSearch('')
            setShowSearch(false)
        }
    }

    return showSearch ? (
        <div className='w-full bg-[#0F172A] px-4 sm:px-8 py-4 shadow-lg'>

            <div className='max-w-4xl mx-auto'>

                {/* HEADER */}
                <div className='flex items-center justify-between mb-3'>

                    <p className='text-white text-xs tracking-[0.2em] uppercase'>
                        Search Stylehood
                    </p>

                    <button
                        type='button'
                        aria-label='Close search'
                        onClick={() => {
                            setSearch('')
                            setShowSearch(false)
                        }}
                        className='text-gray-400 hover:text-[#F97316] text-2xl leading-none transition-colors'
                    >
                        ×
                    </button>

                </div>

                {/* SEARCH INPUT */}
                <div className='flex items-center bg-white rounded-lg overflow-hidden h-11'>

                    <div className='flex items-center justify-center px-4'>
                        <img
                            src={assets.search_icon}
                            alt='Search'
                            className='w-4 opacity-60'
                        />
                    </div>

                    <input
                        autoFocus
                        value={searchText}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleSearch}
                        type='text'
                        placeholder='Search for your favourite styles...'
                        className='flex-1 h-full pr-4 outline-none text-[#0F172A] bg-white text-sm placeholder-gray-400'
                    />

                </div>

                {/* RELATED PRODUCTS */}
                {searchText.trim() !== '' && (

                    <div className='mt-3 bg-white rounded-xl p-3 max-h-80 overflow-y-auto'>

                        {filteredProducts.length > 0 ? (

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>

                                {filteredProducts.map((item, index) => {

                                    const productName =
                                        typeof item?.name === 'string'
                                            ? item.name
                                            : 'Unnamed Product'

                                    // FIX 2: Prevent Image[0] crash
                                    const productImages = Array.isArray(item?.Image)
                                        ? item.Image
                                        : []

                                    const productImage = productImages.find(
                                        image =>
                                            typeof image === 'string' &&
                                            image.trim() !== ''
                                    )

                                    return (
                                        <Link
                                            key={item?._id || `${productName}-${index}`}
                                            to={
                                                item?._id
                                                    ? `/product/${item._id}`
                                                    : '/collection'
                                            }
                                            onClick={() => {
                                                setSearch('')
                                                setShowSearch(false)
                                            }}
                                            className='flex items-center gap-3 p-2 rounded-lg hover:bg-[#FFF7ED] transition'
                                        >

                                            {productImage ? (
                                                <img
                                                    src={productImage}
                                                    alt={productName}
                                                    className='w-12 h-14 object-cover rounded-md'
                                                />
                                            ) : (
                                                <div className='w-12 h-14 shrink-0 rounded-md bg-gray-100 flex items-center justify-center'>
                                                    <span className='text-[10px] text-gray-400'>
                                                        No image
                                                    </span>
                                                </div>
                                            )}

                                            <div className='min-w-0'>

                                                <p className='text-sm font-medium text-[#0F172A] truncate'>
                                                    {productName}
                                                </p>

                                                <p className='text-xs text-[#F97316] mt-1'>
                                                    {item?.price != null
                                                        ? `PKR ${item.price}`
                                                        : 'Price unavailable'}
                                                </p>

                                            </div>

                                        </Link>
                                    )
                                })}

                            </div>

                        ) : (

                            <p className='text-sm text-gray-500 text-center py-4'>
                                No products found.
                            </p>

                        )}

                    </div>
                )}

                {/* ORANGE LINE */}
                <div className='flex justify-center mt-3'>
                    <div className='w-10 h-0.5 bg-[#F97316] rounded-full'></div>
                </div>

            </div>

        </div>
    ) : null
}

export default SearchBar