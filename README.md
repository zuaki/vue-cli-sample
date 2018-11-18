# vue-cli-sample

VueCli3のの学習用。  

## インストール

事前にVueCli3をグローバルインストールする必要があります。  

`$ npm install -g @vue/cli`

その後、通常通り `$ npm install` する。

## 目的

### pugでvue書く

pugで書けると楽になるので、pugで書けることの確認。

### tyapescriptでvue書く

Typescriptで書けた方が型推論がきくので、どうやってvueをTypescriptで書けるか試す。  
また、@typesがないものは生javascriptで書く方が楽なので、そのあたりの切り分けを実際に試す。

### SASSで書く

SASSで書けると楽になるので、SASSで書けることの確認。

## 気になり

### フォーマッター

vueファイルかつ、langを指定してpugとかsassにした場合に、フォーマッターはどう使えるのか。  
vueファイル内でhtml、js、cssを含むことになるので、どういう仕組みでフォーマットしているのか気になる。  

### REST APIとの連携

まだ試せていないが、REST APIとの連携周りも実装したい。  
AWSにREST API用意して、作るのがいいかな

