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

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
