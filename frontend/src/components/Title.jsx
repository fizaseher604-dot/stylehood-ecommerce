

const Title = ({ text1, text2 }) => {
  return (
    <div className="flex flex-col items-center mb-10">

      <span className="mb-3 px-4 py-1 rounded-full bg-[#FFF7ED] text-[#F97316] text-xs font-semibold uppercase tracking-wider">
        {text1}
      </span>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] text-center">
        {text2}
      </h2>

      <div className="mt-4 w-12 h-1 rounded-full bg-[#F97316]"></div>

    </div>
  )
}

export default Title