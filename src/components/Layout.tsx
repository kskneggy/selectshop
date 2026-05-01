import { Link, NavLink, Outlet } from 'react-router-dom';
import { Bookmark, Map as MapIcon, Scale, Store, Tag } from 'lucide-react';
import { clsx } from 'clsx';
import { useSavedShops } from './SavedList';
import { useCompareShops } from './CompareList';

const navItems = [
  { to: '/', label: 'ショップ', Icon: Store, end: true },
  { to: '/brands', label: 'ブランド', Icon: Tag },
  { to: '/map', label: 'マップ', Icon: MapIcon },
  { to: '/saved', label: '保存', Icon: Bookmark },
  { to: '/compare', label: '比較', Icon: Scale },
];

export function Layout() {
  const saved = useSavedShops();
  const compare = useCompareShops();
  const counts: Record<string, number> = {
    '/saved': saved.count,
    '/compare': compare.count,
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white/95 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="text-base sm:text-lg font-semibold tracking-tight">
            selectshop<span className="text-neutral-400">.tokyo</span>
          </Link>
          <Link
            to="/about"
            className="text-xs sm:text-sm text-neutral-500 hover:text-neutral-900 px-2 py-1.5"
          >
            About
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-5 pb-24">
        <Outlet />
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-30"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-5">
          {navItems.map((item) => {
            const count = counts[item.to];
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  clsx(
                    'flex flex-col items-center justify-center gap-0.5 py-2 min-h-[56px] relative',
                    isActive ? 'text-neutral-900' : 'text-neutral-500 hover:text-neutral-900 active:bg-neutral-50'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.Icon
                      className={clsx('w-5 h-5', isActive && 'stroke-[2.5]')}
                    />
                    <span className="text-[10px] leading-none">{item.label}</span>
                    {count !== undefined && count > 0 && (
                      <span className="absolute top-1 right-[calc(50%-1.25rem)] bg-neutral-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full leading-none">
                        {count}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
