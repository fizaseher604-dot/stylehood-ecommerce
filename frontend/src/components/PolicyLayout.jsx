

const PolicyLayout = ({ title, subtitle, updated, sections }) => {
  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 sm:py-10 lg:py-12">

      <div className="mx-auto max-w-6xl">

        {/* Page Header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-[#0F172A] px-6 py-9 text-white sm:px-10 sm:py-11">

          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#F97316]/10 blur-2xl" />

          <div className="absolute -bottom-24 right-24 h-48 w-48 rounded-full bg-orange-500/10 blur-2xl" />

          <div className="relative z-10">

            <div className="mb-4 flex items-center gap-3">
              <span className="h-1 w-10 rounded-full bg-[#F97316]" />

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#F97316]">
                STYLEHOOD
              </p>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {subtitle}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#F97316]" />

              <p className="text-xs font-medium text-slate-300">
                Last updated: {updated}
              </p>
            </div>

          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-4">

          {sections.map((section, index) => (
            <section
              key={index}
              className="group rounded-xl border border-gray-200 bg-white p-5 transition-all duration-300 hover:border-[#F97316]/60 hover:shadow-md sm:p-7"
            >

              <div className="flex items-start gap-4">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0F172A] text-sm font-bold text-[#F97316] transition-colors duration-300 group-hover:bg-[#F97316] group-hover:text-white">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="min-w-0 flex-1">

                  <h2 className="mb-3 text-base font-bold leading-6 text-[#0F172A] sm:text-lg">
                    {section.heading.replace(/^\d+\.\s*/, '')}
                  </h2>

                  <p className="whitespace-pre-line text-sm leading-7 text-gray-600 sm:text-base">
                    {section.text}
                  </p>

                </div>

              </div>

            </section>
          ))}

        </div>

        {/* Contact Support */}
        <div className="mt-8 flex flex-col gap-4 rounded-xl border border-orange-200 bg-orange-50/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

          <div>
            <h3 className="text-base font-bold text-[#0F172A]">
              Need Help?
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-600">
              Have questions? Our team is here to help you with your Stylehood order.
            </p>
          </div>

          <a
            href="/contact"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#0F172A] px-5 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[#F97316]"
          >
            Contact Us
            <span className="ml-2" aria-hidden="true">→</span>
          </a>

        </div>

      </div>

    </div>
  )
}

export default PolicyLayout
