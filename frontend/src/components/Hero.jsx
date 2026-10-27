
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="mx-4 sm:mx-8 lg:mx-12 mt-6 rounded-2xl overflow-hidden bg-gradient-to-r from-orange-50 via-white to-orange-100 shadow-lg">

      <div className="flex flex-col-reverse sm:flex-row items-center">

        {/* Left Side */}
        <div className="w-full sm:w-2/5 px-8 lg:px-16 py-14">

          {/* Badge */}
          <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            ✨ NEW COLLECTION 2026
          </span>

          {/* Heading */}
          <h1 className="prata-regular text-5xl lg:text-7xl text-gray-800 leading-tight">
            Fashion
            <br />
            For Every
            <span className="text-orange-500"> Style</span>
          </h1>

          {/* Description */}
          <p className="text-gray-600 mt-6 leading-8 text-base">
            Discover premium quality fashion with our latest arrivals.
            Upgrade your wardrobe with trendy outfits designed for comfort,
            elegance, and confidence.
          </p>

          {/* Buttons */}
<div className="flex flex-row items-center gap-3 sm:gap-4 mt-7 sm:mt-8 w-full sm:w-auto">

  <Link
    to="/collection"
    className="flex-1 sm:flex-none text-center bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-7 py-3 rounded-lg transition duration-300 shadow-md text-sm sm:text-base font-medium whitespace-nowrap"
  >
    Shop Now →
  </Link>

  <Link
    to="/collection"
    className="flex-1 sm:flex-none text-center border border-gray-400 hover:border-orange-500 hover:text-orange-500 px-4 sm:px-7 py-3 rounded-lg transition duration-300 text-sm sm:text-base font-medium whitespace-nowrap"
  >
    Explore
  </Link>

</div>

          {/* Features */}
          <div className="flex gap-8 mt-10 text-sm text-gray-600">
            <div>
              <h3 className="font-bold text-lg text-black">10K+</h3>
              Happy Customers
            </div>

            <div>
              <h3 className="font-bold text-lg text-black">500+</h3>
              New Products
            </div>

            <div>
              <h3 className="font-bold text-lg text-black">24/7</h3>
              Support
            </div>
          </div>

        </div>

        {/* Right Side */}
        <div className="w-full sm:w-3/5 relative overflow-hidden">

          {/* Discount Badge */}
          <div className="absolute top-6 right-6 bg-orange-500 text-white px-5 py-2 rounded-full shadow-lg z-10 font-semibold">
            30% OFF
          </div>

          <img
           src={assets.hero_img}
           alt="Stylehood fashion collection"
           width="1200"
           height="600"
           fetchPriority="high"
           loading="eager"
           decoding="async"
           className="h-full w-full object-cover"
/>

        </div>

      </div>
    </div>
  );
};

export default Hero;