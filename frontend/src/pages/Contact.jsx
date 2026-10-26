import  { useState } from 'react'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const Contact = () => {

  const [submitted, setSubmitted] = useState(false)

  const onSubmitHandler = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className='bg-white'>

      {/* Hero */}
      <div className='max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-10'>

        <div className='relative h-[300px] sm:h-[380px] overflow-hidden rounded-[24px]'>

          <img
          src={assets.contact_img}
          alt="About Stylehood"
          width="800"
          height="600"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
         />

          <div className='absolute inset-0 bg-[#0F172A]/65'></div>

          <div className='absolute inset-0 flex flex-col items-center justify-center text-center px-5'>

            <p className='text-[#F97316] text-xs sm:text-sm tracking-[5px] font-medium mb-5'>
              STYLEHOOD
            </p>

            <h1 className='text-white text-4xl sm:text-6xl font-semibold tracking-tight'>
              Contact Us
            </h1>

            <p className='text-gray-200 text-sm sm:text-base mt-5 max-w-md leading-7'>
              We are always here to help. Get in touch with our team.
            </p>

          </div>

        </div>

      </div>


      {/* Contact Area */}
      <div className='max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-16 sm:py-24'>

        <div className='grid lg:grid-cols-5 gap-12 lg:gap-20'>

          {/* Information */}
          <div className='lg:col-span-2'>

            <p className='text-[#F97316] text-xs tracking-[3px] font-semibold uppercase mb-4'>
              Get In Touch
            </p>

            <h2 className='text-[#0F172A] text-3xl sm:text-4xl font-semibold leading-tight'>
              Let’s make
              <br />
              something happen.
            </h2>

            <p className='text-gray-500 text-sm leading-7 mt-6 max-w-sm'>
              Whether you have a question about our products, your order,
              or anything else, our team is ready to help.
            </p>


            <div className='mt-10 space-y-7'>

              <div>
                <p className='text-xs text-gray-400 uppercase tracking-[2px] mb-2'>
                  Visit Us
                </p>

                <p className='text-[#0F172A] font-medium'>
                  Lahore, Pakistan
                </p>
              </div>


              <div>
                <p className='text-xs text-gray-400 uppercase tracking-[2px] mb-2'>
                  Phone
                </p>

                <p className='text-[#0F172A] font-medium'>
                  03123456655
                </p>
              </div>


              <div>
                <p className='text-xs text-gray-400 uppercase tracking-[2px] mb-2'>
                  Email
                </p>

                <p className='text-[#0F172A] font-medium'>
                  admin@stylehood.com
                </p>
              </div>

            </div>


            {/* WhatsApp */}
            <a
              href='https://wa.me/923123456655'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-3 mt-9 bg-[#0F172A] text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-[#F97316] transition-all duration-300'
            >
              <span className='text-lg'>✦</span>
              Chat on WhatsApp
            </a>


            {/* Business Hours */}
            <div className='mt-12 pt-8 border-t border-gray-200'>

              <p className='text-xs text-gray-400 uppercase tracking-[2px] mb-5'>
                Business Hours
              </p>

              <div className='space-y-3 text-sm'>

                <div className='flex justify-between max-w-xs'>
                  <span className='text-gray-500'>
                    Monday - Friday
                  </span>

                  <span className='text-[#0F172A] font-medium'>
                    9:00 AM - 8:00 PM
                  </span>
                </div>

                <div className='flex justify-between max-w-xs'>
                  <span className='text-gray-500'>
                    Saturday
                  </span>

                  <span className='text-[#0F172A] font-medium'>
                    10:00 AM - 6:00 PM
                  </span>
                </div>

                <div className='flex justify-between max-w-xs'>
                  <span className='text-gray-500'>
                    Sunday
                  </span>

                  <span className='text-[#F97316] font-medium'>
                    Closed
                  </span>
                </div>

              </div>

            </div>

          </div>


          {/* Form */}
          <div className='lg:col-span-3'>

            <div className='bg-[#F8FAFC] rounded-[24px] p-7 sm:p-10 border border-gray-100'>

              {!submitted ? (

                <>
                  <h3 className='text-[#0F172A] text-2xl font-semibold mb-8'>
                    Send us a message
                  </h3>

                  <form
                    onSubmit={onSubmitHandler}
                    className='space-y-6'
                  >

                    <div className='grid sm:grid-cols-2 gap-5'>

                      <div>
                        <label className='block text-xs font-medium text-gray-500 mb-2'>
                          YOUR NAME
                        </label>

                        <input
                          type='text'
                          required
                          placeholder='Enter your name'
                          className='w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#F97316] transition-all'
                        />
                      </div>


                      <div>
                        <label className='block text-xs font-medium text-gray-500 mb-2'>
                          EMAIL ADDRESS
                        </label>

                        <input
                          type='email'
                          required
                          placeholder='Enter your email'
                          className='w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#F97316] transition-all'
                        />
                      </div>

                    </div>


                    <div>
                      <label className='block text-xs font-medium text-gray-500 mb-2'>
                        SUBJECT
                      </label>

                      <input
                        type='text'
                        required
                        placeholder='What can we help you with?'
                        className='w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#F97316] transition-all'
                      />
                    </div>


                    <div>
                      <label className='block text-xs font-medium text-gray-500 mb-2'>
                        MESSAGE
                      </label>

                      <textarea
                        rows='5'
                        required
                        placeholder='Write your message here...'
                        className='w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none resize-none focus:border-[#F97316] transition-all'
                      ></textarea>
                    </div>


                    <button
                      type='submit'
                      className='w-full bg-[#0F172A] text-white py-4 rounded-xl text-sm font-medium hover:bg-[#F97316] transition-all duration-300'
                    >
                      SEND MESSAGE
                    </button>

                  </form>
                </>

              ) : (

                <div className='min-h-[430px] flex flex-col items-center justify-center text-center'>

                  <div className='w-16 h-16 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-2xl mb-6'>
                    ✓
                  </div>

                  <h3 className='text-[#0F172A] text-2xl font-semibold'>
                    Message Sent!
                  </h3>

                  <p className='text-gray-500 text-sm leading-7 max-w-sm mt-4'>
                    Thank you for reaching out to Stylehood.
                    Our team will get back to you soon.
                  </p>

                  <button
                    onClick={() => setSubmitted(false)}
                    className='mt-7 text-[#F97316] text-sm font-medium hover:underline'
                  >
                    Send another message
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>


      <NewsLetterBox />

    </div>
  )
}

export default Contact