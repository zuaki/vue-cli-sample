<template lang="pug">
#nav.navbar.navbar-expand-sm.bg-dark
  // 画面幅にあわせてメニューボタンに切り替わるのはnavbar-expand-smクラスとnavbar-togglerクラスで行っている
  button.navbar-toggler(type="button" data-toggle="collapse" data-target="#nav-menu" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation")
    button.btn.btn-light
      .fas.fa-bars

  #nav-menu.collapse.navbar-collapse
    ul.navbar-nav.mr-auto
      li.nav-item
        router-link.nav-link(to="/worktime")
          h3 勤怠
      li.nav-item
        router-link.nav-link(to="/usersetting")
          h3 設定
    .form-inline
      button.btn.btn.btn-outline-light(type="button" @click="logout()") ログアウト
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { UrlConstants as Url } from "@/constants/Url";

@Component
export default class Navigation extends Vue {

  /**
   * ログアウトしてログインページへ遷移
   */
  private async logout() {
    const logoutResult = await this.$store.dispatch("logout");
    this.$router.push(Url.root);
  }
}
</script>

<style scoped lang="sass">
@import "@/sass/common.sass"

#nav
  #nav-menu
    max-width: $contentsMaxWidth
    margin-right: auto
    margin-left: auto
  .nav-link
    padding: 0.5rem
    color: rgb(150, 150, 150)
    @include link-color(rgb(150, 150, 150))

    &.router-link-exact-active
      color: #fff
</style>