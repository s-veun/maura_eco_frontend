export default function NewsletterSection() {
  return (
    <section className="border-t border-white/10 bg-[#0f1a32] px-3 py-7 sm:px-4 sm:py-8">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Join our newsletter for £10 offs</h3>
          <p className="text-xs text-[#a4b1d3]">Get updates about fresh arrivals and marketplace discounts every week.</p>
        </div>
        <div className="flex w-full max-w-md flex-col items-center gap-2 sm:flex-row">
          <input
            className="h-10 w-full flex-1 rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-[#92a0c6]"
            placeholder="Enter your email address"
          />
          <button className="h-10 w-full rounded-md bg-[#5a3ea8] px-4 text-xs font-semibold text-white sm:w-auto">SEND</button>
        </div>
      </div>
    </section>
  );
}

