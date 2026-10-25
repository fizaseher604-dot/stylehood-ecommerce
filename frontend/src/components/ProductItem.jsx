import  { useContext } from 'react'
import { Link } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'

const ProductItem = ({
  id,
  name,
  image,
  price
}) => {

  const { currency } = useContext(ShopContext)

  const productImage = Array.isArray(image) ? image[0] : image

  return (
    <Link
      to={`/product/${id}`}
      className='group block cursor-pointer'
    >

      <div className='relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-white transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl'>

        <img
          src={productImage}
          alt={name}
          className='w-full aspect-[4/5] object-cover transition-transform duration-500 ease-out group-hover:scale-105'
        />

        <span className='absolute top-3 left-3 bg-[#F97316] text-white text-[9px] font-semibold px-3 py-1 rounded-full tracking-wider shadow-sm'>
          NEW
        </span>

        <div className='absolute bottom-3 left-3 right-3 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300'>
          <div className='w-full bg-[#0F172A]/95 backdrop-blur-sm text-white text-xs font-medium py-2.5 rounded-lg text-center'>
            VIEW PRODUCT
          </div>
        </div>

      </div>

      <div className='pt-3 px-1'>

        <p className='text-[#0F172A] text-sm font-medium truncate group-hover:text-[#F97316] transition-colors duration-300'>
          {name}
        </p>

        <div className='flex items-center justify-between mt-1.5'>

          <p className='text-[#0F172A] text-sm font-semibold'>
            {currency}{price}
          </p>

          <span className='text-[#F97316] text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            View →
          </span>

        </div>

      </div>

    </Link>
  )
}

export default ProductItem