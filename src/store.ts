import Vue from "vue";
import Vuex from "vuex";
import LoginModel from "@/model/Login";

// ログイン認証で使用するため、vuexをVueに取り込む
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // ログイン済みならtrue
    loggedIn: false,
  },
  mutations: {
    // ログイン
    login: (state) => {
      state.loggedIn = true;
    },
    // ログアウト
    logout: (state) => {
      state.loggedIn = false;
    },
  },
  actions: {
    login: (context, params: LoginModel) => {
      // TODO ここでAPI呼び出してログイン処理をする
      // ログイン成功なら、mutationsのlogin()を呼び出す
      context.commit("login");

      // #topic
      // ログイン結果を返したいのであれば、ここでreturnできる
      // 実際にはpromiseが返るので、受け取る側はawaitするなりして結果を受け取る必要がある
      return true;
    },
    logout: (context) => {
      context.commit("logout");
      return true;
    },
  },
});
