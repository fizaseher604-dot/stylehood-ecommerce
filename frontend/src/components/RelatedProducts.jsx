
import { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const RelatedProducts = ({ category, subCategory }) => {
    const { products } = useContext(ShopContext)

    const related = products
        .filter((item) => item.category === category)
        .filter((item) => item.subCategory === subCategory)
        .slice(0, 5)

    return (
        <div className='mt-20 mb-10 px-0'>

            {/* Heading */}
            <div className='text-center mb-10'>
                <div className='flex items-center justify-center gap-3'>
                    <span className='w-10 h-[2px] bg-[#F97316]'></span>

                    <div className='text-2xl sm:text-3xl font-semibold text-[#0F172A]'>
                        <Title text1={'Related'} text2={'Products'} />
                    </div>

                    <span className='w-10 h-[2px] bg-[#F97316]'></span>
                </div>

                <p className='text-sm text-[#64748B] mt-3'>
                    You may also like these styles
                </p>
            </div>

            {/* Products */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-10'>
                {related.map((item) => (
                    <div
                        key={item._id}
                        className='group transition-all duration-300 hover:-translate-y-2'
                    >
                        <div className='rounded-xl overflow-hidden'>
                            <ProductItem
                                id={item._id}
                                name={item.name}
                                price={item.price}
                                image={item.Image}
                            />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default RelatedProducts
