import Vue from 'vue';
import { Route } from 'vue-router';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
// #topic
// jQueryやBootstrap等、画面全体に読込ませなくてはいけないものはここでimportする必要がある
import 'jquery';
import 'bootstrap';

// 画面遷移前のルーターによるフック
// ログイン認証前はログイン画面へ遷移するようにルーターでフックする
// router.tsの各ルーティング情報のmetaプロパティに「isPublic=true」がないものはログイン済みかチェックする
router.beforeEach((to: Route, from: Route, next: any) => {
  if (
    to.matched.some((record) => !record.meta.isPublic) &&
    !store.state.loggedIn
  ) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

// Vueの作成
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
