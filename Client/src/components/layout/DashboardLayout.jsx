import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { btnPrimary } from "../../lib/ui";
import PNG from "../../assets/WatchTowerLogo.png"

function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-lg font-bold tracking-tight">
      <span className="grid h-9 w-9 place-items-center rounded-md text-sm text-paper"><img src={PNG} alt="" /></span>
      WatchTower
    </span>
  );
}

function useNavState() {
  const { pathname } = useLocation();
  const monitorActive = pathname === "/" || (pathname.startsWith("/jobs") && pathname !== "/jobs/new");
  return { pathname, monitorActive };
}

const itemCls = (active) =>
  `rounded-md px-4 py-2 text-[15px] font-medium transition-colors ${active ? "bg-ink text-paper" : "text-ink/70 hover:bg-yellow-50 hover:text-ink"
  }`;

function Stagger({ open, i, children }) {
  return (
    <div
      className={`transition duration-300 ease-out ${open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}
      style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { pathname, monitorActive } = useNavState();
  const { logout } = useAuth();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 hidden bg-paper px-6 py-4 lg:block">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center rounded-lg border border-ink bg-paper px-5 py-3">
          <Link to="/"><Logo /></Link>
          <nav className="flex items-center gap-2">
            <Link to="/" className={itemCls(monitorActive)}>Monitor</Link>
            <button type="button" className={itemCls(false)}>Settings</button>
          </nav>
          <div className="flex items-center justify-end gap-5">
            <button onClick={logout} className="text-sm font-medium text-ink/70 hover:text-ink">Sign out</button>
            <Link to="/jobs/new" className={btnPrimary}>Start monitor</Link>
          </div>
        </div>
      </header>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-ink bg-paper px-4 lg:hidden">
        <Link to="/"><Logo /></Link>
        <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="rounded-md p-2 hover:bg-paper-deep">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
        </button>
      </header>

      <div
        className={`fixed inset-0 z-40 transition-[visibility] duration-0 lg:hidden ${open ? "visible" : "invisible delay-300"}`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-ink/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          className={`absolute inset-y-0 right-0 flex w-72 max-w-[85%] flex-col border-l border-ink bg-paper p-5 transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="rounded-md p-2 hover:bg-paper-deep">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-1">
            <Stagger open={open} i={0}><Link to="/" className={`block text-lg ${itemCls(monitorActive)}`}>Monitor</Link></Stagger>
            <Stagger open={open} i={1}><button type="button" className={`block w-full text-left text-lg ${itemCls(false)}`}>Settings</button></Stagger>
          </nav>
          <div className="mt-auto space-y-4">
            <Stagger open={open} i={2}><Link to="/jobs/new" className={`${btnPrimary} w-full`}>Start monitor</Link></Stagger>
            <Stagger open={open} i={3}><button onClick={logout} className="w-full text-sm font-medium text-ink/70 hover:text-ink">Sign out</button></Stagger>
          </div>
        </aside>
      </div>

      <main className="px-4 py-8 lg:px-10 lg:py-10">
        <Outlet />
      </main>
    </div>
  );
}