import { useLocalList } from '../hooks/useLocalList';

const KEY = 'selectshop:compare';
const MAX = 4;

export function useCompareShops() {
  return useLocalList(KEY, MAX);
}

export function CompareToggleButton({ shopId }: { shopId: string }) {
  const { has, toggle, count } = useCompareShops();
  const inList = has(shopId);
  const full = !inList && count >= MAX;
  return (
    <button
      type="button"
      onClick={() => !full && toggle(shopId)}
      disabled={full}
      className={`text-sm px-3 py-2 rounded-lg border min-h-[40px] inline-flex items-center gap-1.5 transition-colors ${
        inList
          ? 'bg-blue-50 border-blue-300 text-blue-900'
          : full
          ? 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed'
          : 'bg-white border-neutral-300 hover:border-neutral-900'
      }`}
      title={full ? `比較リストは最大 ${MAX} 店まで` : ''}
    >
      <span>⚖</span>
      {inList ? '比較中' : full ? '比較リスト満杯' : '比較に追加'}
    </button>
  );
}
