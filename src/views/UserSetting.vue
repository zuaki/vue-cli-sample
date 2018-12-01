<template lang="pug">
#user-setting
  Navigation

  .container
    .row
      // スマホ表示を考えて、全体的にGridの使い方を勉強する
      // https://tonari-it.com/bootstrap_multicolumn_generator/
      .col
      .col-sm-12.col-md-9
        #setting.card.shadow-lg
          .card-header.bg-dark
          .card-body
            User
      .col
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import User from '@/components/User.vue'; // @ is an alias to /src
import Navigation from '@/components/Navigation.vue';

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
  @include common-contents
</style>
