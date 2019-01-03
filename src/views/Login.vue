<template lang="pug">
#login
  #login-card.card.shadow-lg
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
import { Component, Vue } from "vue-property-decorator";
import { UrlConstants as Url } from "@/constants/Url";
// #topic
// @をつけると、srcまでのパスを省略できる以下の場合、「/src/model/Login」と同義
// @がついているものは自作のものであることが分かりやすいので使用すること
import LoginModel from "@/model/Login";

@Component
export default class Login extends Vue {

  /** ログインID */
  private name: string = "";
  /** パスワード */
  private password: string = "";
  /** エラーメッセージ */
  private errorMessage: string = "";

  /**
   * ログイン処理
   */
  private async login() {
    // ログイン処理をstoreのactionで行うことで、ログイン状態をstoreで保持させる
    // dispatch()は非同期処理なので、ログイン結果をもらう場合は非同期処理の完了を待機する必要がある
    const loginModel: LoginModel = new LoginModel(this.name, this.password);
    const loginResult = await this.$store.dispatch("login", loginModel);

    // TODO ログイン結果に応じて処理を行う(例えばログイン失敗メッセージを表示するとか)
    if (!loginResult) {
      this.errorMessage = "login failure. <br> loginId or password incorrect.";
      return;
    }

    // 次画面へリダイレクト
    this.$router.push(Url.worktime);
  }
}
</script>

<style scoped lang="sass">
// #topic
// <style scoped>内は完全に隔離されるので、変数定義したものを使用したい場合は個別にimportが必要
@import "@/sass/common.sass"

#login
  display: flex
  flex-direction: column // 子要素をflexboxにより縦方向に揃える
  justify-content: center // 子要素をflexboxにより中央に配置する
  align-items: center  // 子要素をflexboxにより中央に配置する
  height: 100vh
  width: 100vw
  background: radial-gradient(#999, #445)

  #login-card
    width: 300px
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
