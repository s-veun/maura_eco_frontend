import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-36 sm:px-6">
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#1a1a2e]">
            <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Contact Us</h1>
            <p className="mt-4 text-sm font-medium leading-7 text-gray-600 dark:text-gray-300">
              Have a question about orders, delivery, or products? Send us a message and our team will respond shortly.
            </p>
            <div className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>Email: support@tableeco.com</p>
              <p>Phone: +1 (800) 555-0142</p>
              <p>Hours: Mon-Fri, 8:00-18:00</p>
            </div>
          </div>

          <form className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#1a1a2e]">
            <div className="space-y-4">
              <Input placeholder="Your name" aria-label="Your name" />
              <Input type="email" placeholder="Your email" aria-label="Your email" />
              <Textarea placeholder="How can we help you?" aria-label="Message" className="min-h-32" />
              <Button type="submit" className="w-full">Send Message</Button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
