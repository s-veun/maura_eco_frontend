import Header from "@/components/header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-36 sm:px-6">
        <section className="rounded-3xl border border-gray-100 bg-white p-10 shadow-sm dark:border-white/10 dark:bg-[#1a1a2e]">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">About TableEco</h1>
          <p className="mt-5 max-w-3xl text-sm font-medium leading-7 text-gray-600 dark:text-gray-300">
            TableEco is a modern commerce experience focused on sustainable, practical, and premium products.
            We combine thoughtful design, transparent sourcing, and reliable fulfillment to deliver products you can trust.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sustainability</p>
              <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">Responsible sourcing</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Quality</p>
              <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">Rigorous product checks</p>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-white/5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Service</p>
              <p className="mt-2 text-sm font-bold text-gray-900 dark:text-white">Fast and secure delivery</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
