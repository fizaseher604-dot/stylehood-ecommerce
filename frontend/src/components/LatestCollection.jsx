
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'
import { Link } from 'react-router-dom'

const LatestCollection = () => {
    const { products } = useContext(ShopContext)

    const latestProducts = products.slice(0, 10)

    return (
        <div className='my-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20'>

            <div className='text-center mb-10'>
                <Title text1={'LATEST'} text2={'COLLECTION'} />

                <p className='max-w-2xl mx-auto mt-4 text-sm sm:text-base text-[#64748B] leading-7'>
                    Discover the latest styles, made to make every look unforgettable.
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 sm:gap-x-5 gap-y-9'>
                {latestProducts.map((item) => (
                    <div
                        key={item._id}
                        className='group transition-all duration-300 hover:-translate-y-2'
                    >
                        <ProductItem
                            id={item._id}
                            image={item.Image}
                            name={item.name}
                            price={item.price}
                        />
                    </div>
                ))}
            </div>

            <div className='flex justify-center mt-12'>
                <Link to='/collection'>
                    <button className='px-8 py-3 border border-[#0F172A] text-[#0F172A] text-sm font-medium tracking-wide rounded-full hover:bg-[#F97316] hover:text-white hover:border-[#F97316] transition-all duration-300'>
                        VIEW ALL COLLECTION
                    </button>
                </Link>
            </div>

        </div>
    )
}

export default LatestCollection
