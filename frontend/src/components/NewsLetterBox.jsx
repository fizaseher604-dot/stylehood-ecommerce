

const NewsLetterBox = () => {
    const onSubmitHandler =(event)=>{
      event.preventDefault();
    }
  return (
    <div className='mx-4 sm:mx-[5vw] md:mx-[7vw] lg:mx-[9vw] my-16'>
      
      <div className='bg-[#0F172A] rounded-xl px-6 sm:px-12 py-12 text-center'>
        
        <p className='text-2xl sm:text-3xl font-medium text-white'>
          Subscribe now & get <span className='text-[#F97316]'>20% off</span>
        </p>

        <p className='text-gray-300 mt-3 text-sm sm:text-base'>
          Stay updated with the latest styles, exclusive offers, and new arrivals from Stylehood.
        </p>

        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row items-center justify-center gap-3 max-w-xl mx-auto mt-7'>
          <input
            className='w-full sm:flex-1 px-5 py-3 rounded-md outline-none text-gray-800'
            type='email'
            placeholder='Enter your email'
            required
          />

          <button
            type='submit'
            className='w-full sm:w-auto bg-[#F97316] hover:bg-orange-600 text-white text-sm font-medium px-8 py-3 rounded-md transition'
          >
            Subscribe
          </button>
        </form>

      </div>
    </div>
  )
}

export default NewsLetterBox