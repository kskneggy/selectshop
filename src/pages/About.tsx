import { allShops, allBrands, allAreas } from '../lib/derive';

export function About() {
  const shopsWithPhotos = allShops.filter((s) => (s.image_paths?.length ?? 0) > 0).length;
  const shopsWithRating = allShops.filter((s) => s.rating !== undefined).length;

  return (
    <article className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight mb-4">About</h1>

      <section className="space-y-4 text-sm leading-relaxed text-neutral-700 mb-8">
        <p>
          首都圏のセレクトショップを「ブランド」「エリア」「テイスト」「価格」「ジャンル」で
          横断検索できるキュレーションサービス。プロのスタイリスト・バイヤーが
          仕入れ・コーディネート構築の素材を見つけるためのツールとして設計されています。
        </p>
      </section>

      <section className="border border-neutral-200 rounded-lg p-5 mb-8 bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-semibold tracking-tight">{allShops.length}</div>
            <div className="text-[11px] text-neutral-500 mt-0.5">店舗</div>
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
        <h2 className="text-base font-semibold mb-2">使い方</h2>
        <ul className="space-y-2 text-sm text-neutral-700 list-disc list-inside">
          <li>
            <b>ショップ検索</b>: エリア・性別・価格帯・テイスト・ジャンルで絞り込み。並び順は「人気/評価/ブランド数/価格/ABC/エリア」から選択。AND/OR切替＋除外フィルタも対応
          </li>
          <li>
            <b>マップ</b>: フィルタ条件を地図上で可視化。ピンの色で価格帯を判別、密集エリアはクラスタ化
          </li>
          <li>
            <b>ブランド一覧</b>: 取扱ブランドから逆引き。「Auralee を扱う 8 店」のような横断検索が出口
          </li>
          <li>
            <b>似ているショップ</b>: 各ショップの詳細ページで、取扱ブランドが近い店を Jaccard 類似度で表示
          </li>
          <li>
            <b>保存リスト</b>: 気になる店を ☆ で保存（端末ローカルに保存）
          </li>
          <li>
            <b>ショップ比較</b>: 2〜4店を選んで取扱ブランドの重なり/差分/全体一覧を表で比較
          </li>
          <li>
            <b>CSV エクスポート</b>: 絞り込み結果を CSV でダウンロード（社内資料用）
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">データについて</h2>
        <ul className="space-y-2 text-sm text-neutral-700 list-disc list-inside">
          <li>初期データは公開メディア（fashion-press, fashionmaptokyo, arkhe.tokyo, BRUTUS 等）と各店公式情報を基に構築</li>
          <li>店舗写真・評価・所在情報は <b>Google Places API</b> から取得（{shopsWithPhotos}/{allShops.length} 店）</li>
          <li>マップは <b>Google Maps</b>（写真クレジットは各ショップ詳細に表記）</li>
          <li>取扱ブランドは「最近の特集記事に記載されたもの」が中心で、季節により変動します</li>
          <li>出典 URL は各ショップ詳細ページに記載</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">ロードマップ</h2>
        <ul className="space-y-2 text-sm text-neutral-700 list-disc list-inside">
          <li><b>v0.2 (now)</b>: 70+店収録、写真・評価・横断検索・比較・保存・CSV対応</li>
          <li><b>v0.3</b>: 営業時間・電話・アポ要否のメタデータ、ブランド側のメタデータ（国・本国フラッグシップ等）</li>
          <li><b>v0.4</b>: 自動収集パイプライン（Anthropic API で公式サイト・SNS から差分検出）、新規取扱ブランドのフィード</li>
          <li><b>v1.0</b>: スタイリスト/バイヤー向けの出張プラン作成、ブランドの取扱深度（フルライン/カプセル/限定）の表現</li>
        </ul>
      </section>

      <section className="text-xs text-neutral-500 border-t border-neutral-200 pt-4">
        <p>
          {shopsWithRating} 店の評価データ。プロのスタイリスト・バイヤー向けプロトタイプ。
          フィードバック歓迎。
        </p>
      </section>
    </article>
  );
}
