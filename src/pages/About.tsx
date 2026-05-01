import { allShops, allBrands, allAreas } from '../lib/derive';

export function About() {
  const shopsWithPhotos = allShops.filter((s) => (s.image_paths?.length ?? 0) > 0).length;

  return (
    <article className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-4">このサービスについて</h1>

      <section className="space-y-3 text-[15px] leading-relaxed text-neutral-700 mb-8">
        <p>
          東京（渋谷・原宿・表参道・代官山・中目黒・銀座・新宿・丸の内・六本木 ほか）の
          <strong>セレクトショップ {allShops.length} 店</strong>を一つの画面で比べられるサービスです。
        </p>
        <p>
          「<strong>このブランドを扱っているお店ってどこ？</strong>」<br />
          「<strong>同じテイストの店、ほかにもあるかな？</strong>」<br />
          「<strong>このエリアでメンズ向けの店を回りたい</strong>」
        </p>
        <p>
          そんなときに、雑誌やSNSをひとつひとつ調べる代わりに、ここでまとめて探せます。
        </p>
      </section>

      <section className="border border-neutral-200 rounded-lg p-5 mb-8 bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-semibold tracking-tight">{allShops.length}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">お店</div>
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">{allBrands.length}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">取扱ブランド</div>
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">{allAreas.length}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">エリア</div>
          </div>
          <div>
            <div className="text-2xl font-semibold tracking-tight">{shopsWithPhotos}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">写真付き</div>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-3">使い方</h2>
        <div className="space-y-3 text-[14px] leading-relaxed text-neutral-700">
          <div>
            <div className="font-medium text-neutral-900 mb-0.5">🏬 ショップ</div>
            <p className="text-neutral-600">エリア・性別・価格帯・テイストで条件を絞ってお店を探せます。</p>
          </div>
          <div>
            <div className="font-medium text-neutral-900 mb-0.5">🗺 マップ</div>
            <p className="text-neutral-600">地図上にお店の場所を表示。ピンの色で価格帯がひと目でわかります。</p>
          </div>
          <div>
            <div className="font-medium text-neutral-900 mb-0.5">🏷 ブランド</div>
            <p className="text-neutral-600">「Auralee はどの店で買える？」のようにブランドからお店を逆引きできます。</p>
          </div>
          <div>
            <div className="font-medium text-neutral-900 mb-0.5">⭐ 保存</div>
            <p className="text-neutral-600">気になるお店を ☆ で保存。お使いの端末（ブラウザ）にメモされます。</p>
          </div>
          <div>
            <div className="font-medium text-neutral-900 mb-0.5">⚖️ 比較</div>
            <p className="text-neutral-600">2〜4 店を選んで「両方で扱っているブランド」「片方にしかないブランド」を一覧できます。</p>
          </div>
          <div>
            <div className="font-medium text-neutral-900 mb-0.5">✨ 似ているお店</div>
            <p className="text-neutral-600">各お店のページに「品揃えが近いお店」を自動で表示。気になる店から似た系統の店をたどれます。</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">お店の情報について</h2>
        <ul className="space-y-1.5 text-[14px] text-neutral-700 list-disc list-inside">
          <li>掲載しているブランドは、雑誌・公式サイト・SNS で公開されている情報を元にまとめています</li>
          <li>店舗の写真・評価・地図情報は Google マップから取得しています</li>
          <li>季節やシーズンによって取扱ブランドは変わります。最新情報は各お店の公式サイトもあわせてご確認ください</li>
          <li>各お店のページに、参考にした記事・公式サイトのリンクを掲載しています</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">これからやりたいこと</h2>
        <ul className="space-y-1.5 text-[14px] text-neutral-700 list-disc list-inside">
          <li>営業時間・電話番号・予約が必要かどうかの表示</li>
          <li>お店ごとに「最近、新しく入荷したブランド」をピックアップ</li>
          <li>「1日でこのエリアの〇店を回るならこの順番」のおすすめ動線</li>
          <li>掲載エリアの拡大（下北沢・蔵前 ほか）</li>
        </ul>
      </section>

      <section className="text-xs text-neutral-500 border-t border-neutral-200 pt-4">
        <p>
          プロのスタイリスト・バイヤーの方を中心に、服が好きな方ならどなたでもご利用いただけます。<br />
          気づいた点・追加してほしい店舗などあればぜひ教えてください。
        </p>
      </section>
    </article>
  );
}
