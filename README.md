# selectshop.tokyo

首都圏のセレクトショップを「ブランド」「エリア」「テイスト」「価格」「ジャンル」で
横断検索できるキュレーションサービス。プロのスタイリスト・バイヤー向け。

## ステータス

- v0.1 prototype
- 静的サイト（GitHub Pages デプロイ）
- データは公開メディア・各店公式情報を基に構築（出典は各ショップ詳細に記載）

## 開発

```bash
pnpm install
pnpm dev      # http://localhost:5173/selectshop/
pnpm build    # dist/ に生成
```

## ディレクトリ

```
src/
├── data/shops.ts       — ショップ実データ
├── types.ts            — Shop / Brand 型定義
├── lib/
│   ├── derive.ts       — ブランド逆引き、エリア一覧 等
│   └── filter.ts       — 検索フィルタロジック
├── components/         — Layout, ShopCard, FilterBar
└── pages/              — SearchPage, ShopDetail, BrandDetail, BrandsIndex, About

scripts/
└── crawl.ts            — 自動収集スクリプト（Phase 2 で実装）

.github/workflows/
├── deploy.yml          — GitHub Pages 自動デプロイ
└── crawl.yml           — 週次データ更新（Phase 2）
```

## ロードマップ

- **Phase 1（now）**: 手動キュレーションデータでプロトタイプ公開
- **Phase 2**: Anthropic Claude API で公式サイト・SNSから自動抽出
- **Phase 3**: 反応次第でキュレーター（プロ）巻き込み・データベース昇格
