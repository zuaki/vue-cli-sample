# vue-cli-sample

VueCli3 のの学習用。

## インストール

事前に VueCli3 をグローバルインストールする必要があります。  
当たり前ですが npm もインストールが必要です。

`$ npm install -g @vue/cli`

その後、通常通り `$ npm install` する。

## 開発で使ったものメモ

- VSCode
- NodeJs 8 以上

### VSCode プラグインで便利だったもの

- ESLint
  - js 関連の lint
- Prettier
  - フォーマッター
- Pug beautify
  - パグのフォーマット。Prettier あれば不要？
- Vetur
  - vue ファイルのシンタックスハイライト等,vuejs 開発には必須

## 目的

### pug で vue 書く

pug で書けると楽になるので、pug で書けることの確認。

```
<template lang="pug">
#work-time-input
  ～pugで書く～
</template>
```

とすれば、pug で書けることが分かった。  
ローダーは別途用意しないといけないが、ローダーを用意するだけで使えるのは便利だ。

### tyapescript で vue 書く

Typescript で書けた方が型推論がきくので、どうやって vue を Typescript で書けるか試す。  
また、@types がないものは生 javascript で書く方が楽なので、そのあたりの切り分けを実際に試す。

vue のビジネスロジックを書く場合と Typescript で書く場合を比較しつつ、別資料にまとめる。

### SASS で書く

SASS で書けると楽になるので、SASS で書けることの確認。

```
<style lang="sass">
#input-modal
  .form-group
    text-align: left
  .work-time
    max-width: 340px
    height: 60px
    font-size: 32px
</style>
```

とすれば、SASS で書ける。  
ローダーは別途用意しないといけないが、ローダーを用意するだけで使えるのは便利だ。

## 気になり

### フォーマッター

vue ファイルかつ、lang を指定して pug とか sass にした場合に、フォーマッターはどう使えるのか。  
vue ファイル内で html、js、css を含むことになるので、どういう仕組みでフォーマットしているのか気になる。

### REST API との連携

まだ試せていないが、REST API との連携周りも実装したい。  
AWS に REST API 用意して、作るのがいいかな

## 微妙なところ

### Lint が厳密すぎる

デバッグ実行(`npm run serve`)で実行した際に、whitespace やシングルクォートかダブルクォートか、かなんていうことも警告してくる。  
フォーマットかければ問題ないが、警告がたくさん出るとちょっとイラっとする。

VSCode だと、設定-テキストエディタ-フォーマットから「Format on Save」を有効にしておけば解決。

### prettier のフォーマット設定(デフォルト)が VueCli3 とあってない

VueCli3 では、文字列はシングルクォートで書くのが正しいというルール。  
しかし、VueCli3 推奨？の prettier は文字列をダブルクォートにフォーマットするのがデフォルトなので、  
`npm run serve` で実行中に ts ファイルをフォーマットすると即怒られる。

さらに、配列のプロパティの末尾にカンマがないと怒られる。

VSCode だと設定-拡張機能-prettier から「Single Quote」を有効、  
「Trailing Comma」を all にしておけば解決。

### vue ファイルかつ、lang 指定のものはフォーマッターが効かない？

prettier は vue サポートしていない

## TODO

### レスポンシブ対応

スマホ表示時の考慮
