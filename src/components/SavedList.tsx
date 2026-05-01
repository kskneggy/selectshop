import { useLocalList } from '../hooks/useLocalList';

const KEY = 'selectshop:saved';

export function useSavedShops() {
  return useLocalList(KEY);
}

export function SaveToggleButton({ shopId }: { shopId: string }) {
  const { has, toggle } = useSavedShops();
  const saved = has(shopId);
  return (
    <button
      type="button"
      onClick={() => toggle(shopId)}
      className={`text-sm px-3 py-2 rounded-lg border min-h-[40px] inline-flex items-center gap-1.5 transition-colors ${
        saved
          ? 'bg-amber-50 border-amber-300 text-amber-900'
          : 'bg-white border-neutral-300 hover:border-neutral-900'
      }`}
    >
      <span>{saved ? '★' : '☆'}</span>
      {saved ? '保存中' : '保存'}
    </button>
  );
}
