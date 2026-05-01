import { Link, Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-neutral-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-baseline justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            selectshop<span className="text-neutral-400">.tokyo</span>
          </Link>
          <nav className="flex gap-4 text-sm text-neutral-500">
            <Link to="/" className="hover:text-neutral-900">ショップ</Link>
            <Link to="/map" className="hover:text-neutral-900">マップ</Link>
            <Link to="/brands" className="hover:text-neutral-900">ブランド</Link>
            <Link to="/about" className="hover:text-neutral-900">About</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 text-xs text-neutral-500 flex flex-wrap gap-4 justify-between">
          <div>プロのスタイリスト・バイヤー向け。首都圏セレクトショップのキュレーション。</div>
          <div>v0.1 — prototype</div>
        </div>
      </footer>
    </div>
  );
}
