import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
// #topic
// jQueryやBootstrap等、画面全体に読込ませなくてはいけないものはここでimportする必要がある
import 'jquery';
import 'bootstrap';

Vue.config.productionTip = false;

// TODO ログイン認証をしないと使用できないようにする
/*
router.beforeEach((to: Route, from: Route, next: any) => {
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !Auth._loggedIn
  ) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});
*/

// Vueの作成
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
