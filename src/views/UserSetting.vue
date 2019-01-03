<template lang="pug">
#user-setting
  Navigation

  #setting.card.shadow-lg
    .card-header.bg-dark
    .card-body
      User
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import User from "@/components/User.vue"; // @ is an alias to /src
import Navigation from "@/components/Navigation.vue";

@Component({
  components: {
    User,
    Navigation,
  },
})
export default class UserSetting extends Vue {

}
</script>

<style scoped lang="sass">
@import "@/sass/common.sass"

#setting
  @include common-contents-half
</style>
