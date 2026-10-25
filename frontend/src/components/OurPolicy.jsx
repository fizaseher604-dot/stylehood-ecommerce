
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='my-16 px-4 sm:px-8 lg:px-12'>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8'>

        {/* Easy Exchange */}
        <div className='group bg-[#0F172A] rounded-xl px-5 py-7 text-center border border-[#1E293B] transition-all duration-300 hover:-translate-y-1 hover:border-[#F97316] hover:shadow-xl'>

          <div className='w-14 h-14 mx-auto mb-5 rounded-full bg-[#1E293B] flex items-center justify-center group-hover:bg-[#F97316] transition-all duration-300'>
            <img
              src={assets.exchange_icon}
              className='w-8'
              alt='Easy Exchange'
            />
          </div>

          <p className='text-white font-semibold text-base'>
            Easy Exchange Policy
          </p>

          <p className='text-gray-400 text-sm mt-2 leading-6'>
            Hassle-free exchanges made simple for you.
          </p>

        </div>


        {/* 7 Days Return */}
        <div className='group bg-[#0F172A] rounded-xl px-5 py-7 text-center border border-[#1E293B] transition-all duration-300 hover:-translate-y-1 hover:border-[#F97316] hover:shadow-xl'>

          <div className='w-14 h-14 mx-auto mb-5 rounded-full bg-[#1E293B] flex items-center justify-center group-hover:bg-[#F97316] transition-all duration-300'>
            <img
              src={assets.quality_icon}
              className='w-8'
              alt='7 Days Return'
            />
          </div>

          <p className='text-white font-semibold text-base'>
            7 Days Return Policy
          </p>

          <p className='text-gray-400 text-sm mt-2 leading-6'>
            Shop confidently with our easy return policy.
          </p>

        </div>


        {/* Customer Support */}
        <div className='group bg-[#0F172A] rounded-xl px-5 py-7 text-center border border-[#1E293B] transition-all duration-300 hover:-translate-y-1 hover:border-[#F97316] hover:shadow-xl'>

          <div className='w-14 h-14 mx-auto mb-5 rounded-full bg-[#1E293B] flex items-center justify-center group-hover:bg-[#F97316] transition-all duration-300'>
            <img
              src={assets.support_img}
              className='w-8'
              alt='Customer Support'
            />
          </div>

          <p className='text-white font-semibold text-base'>
            Best Customer Support
          </p>

          <p className='text-gray-400 text-sm mt-2 leading-6'>
            We're always here to help whenever you need us.
          </p>

        </div>

      </div>

    </div>
  )
}

export default OurPolicy