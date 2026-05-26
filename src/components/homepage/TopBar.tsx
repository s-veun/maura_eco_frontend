export default function TopBar() {
  return (
    <div className="bg-[#3605bc] px-3 py-1.5 text-[10px] text-white md:px-4 md:text-[11px]">
      <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-3">
        <div className="hidden items-center gap-3 text-white/95 sm:flex">
          <span>About Us</span>
          <span>My account</span>
          <span>Wishlist</span>
        </div>
        <p className="text-center text-white/95">
          FREE delivery on all orders over $45 and returns in 14 days
        </p>
        <div className="hidden items-center gap-2 text-white/95 sm:flex">
          <span>English</span>
          <span>USD</span>
          <span>Order Tracking</span>
        </div>
      </div>
    </div>
  );
}

