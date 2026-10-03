import { Link } from "react-router-dom";
import PNG from "../../assets/WhiteLogo.png"

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-white">
      <p>
        <img src={PNG} alt="" className="h-9 w-9" />
      </p>
      <span className="text-[19px] font-bold tracking-tight text-white">
        WatchTower
      </span>
    </Link>
  );
}

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div
      className="min-h-screen bg-[#EFF1EE] text-[#12161A] antialiased"
      style={{ fontFamily: "'Schibsted Grotesk', system-ui, sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&display=swap');`}</style>

      <div className="grid min-h-screen md:grid-cols-12">
        <div className="flex flex-col bg-black text-white justify-between border-b border-[#CDD2D6] px-6 py-8 md:col-span-6 md:border-b-0 md:border-r md:px-12 md:py-10">
          <Wordmark />
          <h1 className="max-w-lg py-16 text-5xl font-bold leading-[1.02] tracking-[-0.035em] md:py-0 md:text-7xl">
            Your API goes down. You find out first.
          </h1>
          <p className="hidden text-sm text-[#59616A] md:block">
            © 2026 WatchTower
          </p>
        </div>

        <div className="flex items-center px-6 py-12 md:col-span-6 md:px-12">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            {subtitle && <p className="mt-2 text-[#59616A]">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <p className="mt-6 text-sm text-[#59616A]">{footer}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
