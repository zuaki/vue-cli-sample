import Vue from "vue";
import Router from "vue-router";
import { UrlConstants as Url } from "@/constants/Url";
import UserSetting from "./views/UserSetting.vue";
import WorkTimeInput from "./views/WorkTimeInput.vue";
import Login from "./views/Login.vue";
Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: Url.root,
      name: "root",
      redirect: Url.login,
    },
    {
      path: Url.login,
      name: "login",
      component: Login,
      meta: { isPublic: true },
    },
    {
      path: Url.worktime,
      name: "worktime",
      component: WorkTimeInput,
    },
    {
      path: Url.userSetting,
      name: "usersetting",
      component: UserSetting,
    },
  ],
});
