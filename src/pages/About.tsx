import { allShops, allBrands, allAreas } from '../lib/derive';

export function About() {
  return (
    <article className="prose max-w-none">
      <h1 className="text-2xl font-semibold tracking-tight mb-4">About</h1>
      <div className="space-y-4 text-sm leading-relaxed text-neutral-700">
        <p>
          首都圏のセレクトショップを「ブランド」「エリア」「テイスト」「価格」「ジャンル」で
          横断検索できるキュレーションサービス。プロのスタイリスト・バイヤーが
          仕入れやコーディネート構築の手がかりを得るためのツールとして設計。
        </p>
        <p>
          現在 <b>{allShops.length}</b> 店、<b>{allBrands.length}</b> 取扱ブランド、
          <b>{allAreas.length}</b> エリアを収録。
          初期データは公開メディア・各店公式情報を基に構築（出典は各ショップ詳細ページに記載）。
        </p>
        <p className="text-neutral-500">
          v0.1 prototype — フィードバック歓迎。
        </p>
      </div>
    </article>
  );
}
