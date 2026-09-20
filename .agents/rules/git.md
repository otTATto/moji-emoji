# Git に関するルール

## ブランチについて

- 大まかには main, feat/, fix/ の 3 種類のブランチから構成される
- 最新の main ブランチから作業ブランチ `feature/**` または `fix/**` を切って作業を開始する

## コミットメッセージについて

- 1行目に Commit Subject, 2行目に任意で Description を書く
- Commit Subject は Conventional Commits に準拠した形式を意識する
  - 本文は日本語
  - スコープは任意
  - 例: `feat(triage): 推定されたプロトコルに応じて症状状況の質問事項を選定&表示`
- 差分ファイル名をそのままコミットメッセージに書くだけで満足せず、実装の背景にあるアルゴリズムやメンタルモデルを汲み取れるように上手く要約する
  - 悪い例: `fix: アカウント登録 API を修正`
  - 良い例: `fix(register): 重複したメールアドレスでのアカウント登録を拒否する`
- 1行のコミットメッセージにまとめられない場合は、任意で Description を箇条書きで書く

## Pull Request について

- PR はテンプレート `.github/PULL_REQUEST_TEMPLATE.md` に沿って記述する
- PR には `.github/labels.yml` で定義されるラベルを付与することができる
- PR タイトルは `feat(register): アカウント登録 API の実装` のように、Conventional Commits に準拠した形式で書く
- レビュワーのレビュー負担軽減のため、1PR あたりのコード差分は原則 500 行以内とする
- 特に差分が 1,000 行を超える場合は、必ず複数の PR に分割する
- レビュワーにより Approve されるまで main には merge しない
