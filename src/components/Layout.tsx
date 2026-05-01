import { Link, NavLink, Outlet } from 'react-router-dom';
import { clsx } from 'clsx';

const navItems = [
  { to: '/', label: 'ショップ', end: true },
  { to: '/map', label: 'マップ' },
  { to: '/brands', label: 'ブランド' },
  { to: '/about', label: 'About' },
];

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="text-base sm:text-xl font-semibold tracking-tight shrink-0">
            selectshop<span className="text-neutral-400 hidden sm:inline">.tokyo</span>
          </Link>
          <nav className="flex gap-1 sm:gap-2 text-xs sm:text-sm">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'px-2.5 sm:px-3 py-2 rounded-full min-h-[36px] flex items-center transition-colors',
                    isActive
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-5 sm:py-6">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-5 text-[11px] sm:text-xs text-neutral-500 flex flex-wrap gap-3 justify-between">
          <div>プロのスタイリスト・バイヤー向け。首都圏セレクトショップのキュレーション。</div>
          <div className="font-mono">v0.1 prototype</div>
        </div>
      </footer>
    </div>
  );
}
