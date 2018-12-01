<template lang="pug">
  #app
    router-view
</template>


<style lang="sass">
// #topic
// ※全体に反映させたいスタイルはapp.vueに書いて、他のstyleはscopedを付けておく。そうしないとグローバルなスタイル浸食が発生してしまう
// #topic
// node_modulesのCSSを使用する場合はimportで対応する
@import "../node_modules/bootstrap/dist/css/bootstrap.min.css"
@import "@/sass/common.sass"

// 規定の背景色を指定
html
  min-height: 100%
  background: radial-gradient(#fff, #778)
  
body
  // 既存スタイルの取り消しを行う
  background: initial
  background-color: initial
</style>
