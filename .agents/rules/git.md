# Git に関するルール

## ブランチについて

- 大まかには main, feat/, fix/ の 3 種類のブランチから構成される
- 最新の main ブランチから作業ブランチ `feature/**` または `fix/**` を切って作業を開始する

## コミットメッセージについて

- 1行目に Commit Subject, 2行目に任意で Description を書く
- Commit Subject は Conventional Commits に準拠した形式を意識する
  - 本文は日本語
  - スコープは任意
  - 例: `feat(suggest): 選択文字列に応じた絵文字候補を表示`
- 差分ファイル名をそのままコミットメッセージに書くだけで満足せず、実装の背景にあるアルゴリズムやメンタルモデルを汲み取れるように上手く要約する
  - 悪い例: `fix: 絵文字 API を修正`
  - 良い例: `fix(suggest): 空文字選択時は絵文字サジェスト API を呼ばない`
- 1行のコミットメッセージにまとめられない場合は、任意で Description を箇条書きで書く

## Pull Request について

- PR はテンプレート `.github/PULL_REQUEST_TEMPLATE.md` に沿って記述する
- PR には `.github/labels.yml` で定義されるラベルを付与することができる
- PR タイトルは `feat(popup): 絵文字の再生成操作を追加` のように、Conventional Commits に準拠した形式で書く
- レビュワーのレビュー負担軽減のため、1PR あたりのコード差分は原則 500 行以内とする
- 特に差分が 1,000 行を超える場合は、必ず複数の PR に分割する
- レビュワーにより Approve されるまで main には merge しない
