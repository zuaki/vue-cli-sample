<template lang="pug">
  #app
    .row
      .col-12
        #nav
          router-link(to="/") 
            button.btn.btn-sm.btn-info(type="button") 勤怠
          router-link(to="/usersetting")
            button.btn.btn-sm.btn-info(type="button") 設定
          router-link(to="/logout")
            button.btn.btn-sm.btn-info(type="button") ログアウト
    .row
      .col-12
        router-view
</template>

<style lang="sass">
// #topic
// node_modulesのCSSを使用する場合はimportで対応する。
@import "../node_modules/bootstrap/dist/css/bootstrap.min.css"

#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: #2c3e50
  width: 1300px
  padding-right: 15px
  padding-left: 15px
  margin-right: auto
  margin-left: auto
#nav
  text-align: right
  padding-top: 0.5rem
  padding-bottom: 2rem
  a 
    font-weight: bold
    padding: 0.5rem
    &.router-link-exact-active
      color: #42b983
</style>
