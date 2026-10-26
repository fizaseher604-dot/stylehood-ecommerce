
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  const features = [
    {
      icon: '✓',
      title: 'Quality Assurance',
      description:
        'We carefully select our products to bring you clothing that combines quality, comfort, and lasting style.',
    },
    {
      icon: '↗',
      title: 'Easy & Convenient',
      description:
        'Discover your favorite styles with a smooth and convenient online shopping experience.',
    },
    {
      icon: '♥',
      title: 'Customer First',
      description:
        'We care about your shopping experience and aim to make every visit to Stylehood enjoyable.',
    },
  ]

  return (
    <div className="bg-white text-[#0F172A]">

      {/* Hero Section - Same Style as Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-10">

        <div className="relative h-[300px] sm:h-[380px] overflow-hidden rounded-[24px]">

          <img
              src={assets.about_img}
              alt="About Stylehood"
              width="800"
              height="600"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
/>

          <div className="absolute inset-0 bg-[#0F172A]/65" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">

            <p className="text-[#F97316] text-xs sm:text-sm tracking-[5px] font-medium mb-5">
              OUR STORY
            </p>

            <h1 className="text-white text-4xl sm:text-6xl font-semibold tracking-tight">
              About <span className="text-[#F97316]">Us</span>
            </h1>

            <p className="text-gray-200 text-sm sm:text-base mt-5 max-w-md leading-7">
              Discover the story behind Stylehood and our passion for fashion.
            </p>

          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* About Text */}
          <div>

            <p className="text-[#F97316] text-xs tracking-[3px] font-semibold uppercase mb-4">
              Who We Are
            </p>

            <h2 className="text-[#0F172A] text-3xl sm:text-4xl font-semibold leading-tight">
              Fashion That Fits
              <br />
              <span className="text-[#F97316]">Your Style.</span>
            </h2>

            <p className="text-gray-500 text-sm leading-7 mt-6">
              At Stylehood, we believe fashion is all about expressing who
              you are. We bring you a carefully selected collection of
              stylish, comfortable, and affordable clothing for Men, Women,
              and Kids.
            </p>

            <p className="text-gray-500 text-sm leading-7 mt-4">
              From everyday essentials to trendy seasonal looks, our goal
              is to make it easy for everyone to find clothing they love.
              We bring modern designs and quality together to make your
              shopping experience enjoyable.
            </p>

            {/* Mission */}
            <div className="mt-7 bg-[#F8FAFC] border border-gray-100 border-l-4 border-l-[#F97316] rounded-xl p-5">

              <h3 className="text-[#0F172A] text-lg font-semibold mb-2">
                Our Mission
              </h3>

              <p className="text-gray-500 text-sm leading-7">
                Our mission is to make fashion accessible and enjoyable
                for everyone by offering stylish clothing that balances
                comfort, quality, and affordability.
              </p>

            </div>

          </div>

          {/* About Image */}
          <div className="relative">

            <img
              src={assets.fashion}
              alt="Stylehood Fashion Collection"
              className="w-full h-[300px] sm:h-[400px] object-cover rounded-[24px] shadow-lg"
            />

            <div className="absolute bottom-4 left-4 right-4 sm:right-auto bg-white rounded-xl px-5 py-4 shadow-lg">

              <p className="text-gray-400 text-xs uppercase tracking-[2px]">
                Welcome to
              </p>

              <h3 className="text-[#0F172A] text-xl font-semibold mt-1">
                Style<span className="text-[#F97316]">hood.</span>
              </h3>

            </div>

          </div>

        </div>
      </div>

      {/* Why Choose Us */}
      <div className="bg-[#F8FAFC] border-y border-gray-100">

        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-14">

          <div className="text-center mb-9">

            <p className="text-[#F97316] text-xs tracking-[3px] font-semibold uppercase mb-3">
              The Stylehood Difference
            </p>

            <h2 className="text-[#0F172A] text-2xl sm:text-3xl font-semibold">
              Why Choose <span className="text-[#F97316]">Us?</span>
            </h2>

            <p className="text-gray-500 text-sm mt-3">
              Designed around what matters most to you.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-5">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#F97316] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >

                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#F97316] flex items-center justify-center text-2xl mb-5">
                  {feature.icon}
                </div>

                <h3 className="text-[#0F172A] text-lg font-semibold mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-500 text-sm leading-7">
                  {feature.description}
                </p>

              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="pt-8">
        <NewsLetterBox />
      </div>

    </div>
  )
}

export default About