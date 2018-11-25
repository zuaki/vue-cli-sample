import Vue from 'vue';
import Router from 'vue-router';
import UserSetting from './views/Home.vue';
import WorkTimeInput from './views/WorkTimeInput.vue';
import Login from './views/Login.vue';
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'worktime',
      component: WorkTimeInput,
    },
    {
      path: '/usersetting',
      name: 'usersetting',
      component: UserSetting,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
});
