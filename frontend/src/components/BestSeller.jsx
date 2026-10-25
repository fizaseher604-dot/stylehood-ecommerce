
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {
    const { products } = useContext(ShopContext)

    const bestSeller = products
        .filter((item) => item.bestseller)
        .slice(0, 5)

    return (
        <div className='my-16 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20'>

            {/* Heading */}
            <div className='text-center mb-10'>
                <Title text1={'BEST'} text2={'SELLERS'} />

                <p className='max-w-2xl mx-auto mt-4 text-sm sm:text-base text-[#64748B] leading-7'>
                    Discover the styles everyone’s loving — our best-selling picks, made to elevate every look.
                </p>
            </div>

            {/* Best Seller Products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 sm:gap-x-5 gap-y-9'>
                {bestSeller.map((item) => (
                    <ProductItem
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        image={item.Image}
                        price={item.price}
                    />
                ))}
            </div>

        </div>
    )
}

export default BestSeller
