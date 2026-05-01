/**
 * 自動収集スクリプトの骨格（Phase 2 で本実装）。
 *
 * 想定フロー:
 *   1. src/data/shops.ts の各ショップ website / instagram から
 *      公式サイトと SNS 情報を fetch。
 *   2. Anthropic Claude API（既存 momoru_app と同じキー流用）に
 *      ページHTMLを渡して扱いブランド・営業時間・特徴コメントを抽出。
 *   3. 既存の shop データと差分を取り、変更があれば shops.ts を書き換える。
 *   4. GitHub Actions が変更を自動コミット → Pages に再デプロイ。
 *
 * 現状はプレースホルダ。Phase 2 で実装。
 */

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.log('[crawl] ANTHROPIC_API_KEY not set; skipping (Phase 2 で実装)');
    return;
  }
  console.log('[crawl] Phase 2 で実装予定。今は no-op。');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
