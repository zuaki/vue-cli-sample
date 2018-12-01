<template lang="pug">
#login
  #login-container
    .card.shadow-lg
      .card-header.bg-dark
        // Title
        h1 Login
        div Sign in to your account
      .card-body
        // input Login ID
        .input-group.login-input
          .input-group-prepend
            .input-group-text
              .fas.fa-user
          input#name.form-control(type="text" placeholder="Login ID" v-model:value="name")
        // input Password
        .input-group.login-input
          .input-group-prepend
            .input-group-text
              .fas.fa-lock
          input#password.form-control(type="password" placeholder="Password"  v-model:value="password")
        // Error Message
        #error-msg.text-danger.font-weight-bold
          span(v-html="errorMessage")
        // Login Button
        .float-right
          button#login-btn.btn.btn-outline-primary(v-on:click="login()") Login
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { UrlConstants as Url } from '@/constants/Url';
import LoginModel from '@/model/Login';

@Component
export default class Login extends Vue {

  /** ログインID */
  private name: string = '';
  /** パスワード */
  private password: string = '';
  /** エラーメッセージ */
  private errorMessage = '';

  /**
   * vue mounted
   * 背景色のスタイルを付与
   */
  private mounted() {
    // #topic
    // html要素やbody要素にスタイルを付与したい場合はmounted()でclass付与してbeforeDestroy()でclass除外が良さそう
    // <style>でグローバルスタイル汚染させずにCSSを切り替えできる
    $('#html').addClass('gradient');
  }

  /**
   * vue beforeDestroy
   * 背景色のスタイルを除外
   */
  private beforeDestroy() {
    $('#html').removeClass('gradient');
  }

  /**
   * ログイン処理
   */
  private async login() {
    // ログイン処理をstoreのactionで行うことで、ログイン状態をstoreで保持させる
    // dispatch()は非同期処理なので、ログイン結果をもらう場合は非同期処理の完了を待機する必要がある
    const loginModel: LoginModel = new LoginModel(this.name, this.password);
    const loginResult = await this.$store.dispatch('login', loginModel);

    // TODO ログイン結果に応じて処理を行う(例えばログイン失敗メッセージを表示するとか)
    if (!loginResult) {
      this.errorMessage = 'Login failure. <br> login ID or password incorrect.';
      return;
    }

    // 次画面へリダイレクト
    this.$router.push(Url.worktime);
  }
}
</script>

<style lang="sass">
// ログイン画面だけhtml要素(画面全体)の背景色を変更するためのスタイルを定義
// App.vueに記載しないのは、このスタイルはログイン画面でのみ使用するスタイルのため
.gradient
  min-height: 100%
  background: radial-gradient(#999, #445)
  body
    // 既存スタイルの取り消しを行う
    background: initial
    background-color: initial
</style>

<style scoped lang="sass">
// #topic
// <style scoped>内は完全に隔離されるので、変数定義したものを使用したい場合は個別にimportが必要
@import "@/sass/common.sass"

#login
  #login-container
    // 画面中央に持っていくための設定 start
    position: absolute
    top: 45%
    left: 50%
    transform: translate(-50%,-50%)
    width: 300px
    max-width: 300px
    // 画面中央に持っていくための設定 end
  .card-header
    color: #fff
  .login-input
    padding-bottom: 1rem

  // ログインボタンはBOOTSTRAPの既存カラーに少し手を入れて使う
  #login-btn
    color: $bt-dark-color
    border-color: $bt-dark-color
    &:hover
      color: #fff
      border-color: #fff
</style>
