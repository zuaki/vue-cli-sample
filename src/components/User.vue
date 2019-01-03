<template lang="pug">
#user.container-fluid
  .row
    .col-sm-6.col-12
      // input UserId
      label(for="id") 社員番号
      .input-group.default-input
        .input-group-prepend
          .input-group-text
            .fas.fa-id-card
        input#id.form-control(type="text" v-model:value="id" readonly)
    .col-sm-6.col-12
      // input UserName
      label(for="name") 氏名
      .input-group.default-input
        .input-group-prepend
          .input-group-text
            .fas.fa-user
        input#name.form-control(type="text" v-model:value="name" readonly)
  .row
    .col-sm-6.col-12
      // input UserName
      label(for="name") 氏名
      .input-group.default-input
        .input-group-prepend
          .input-group-text
            .fas.fa-user
        input#name.form-control(type="text" v-model:value="name" readonly)
    .col-sm-6.col-12
      // input UserName
      label(for="name") 氏名
      .input-group.default-input
        .input-group-prepend
          .input-group-text
            .fas.fa-user
        input#name.form-control(type="text" v-model:value="name" readonly)
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Navigation from "@/components/Navigation.vue";

@Component({
  components: {
    Navigation,
  },
})
export default class User extends Vue {

  /** 社員番号 */
  @Prop()
  private id!: string;

  /** 氏名 */
  private name!: string;

  /**
   * vue mounted
   */
  private mounted() {
    // TODO ここでAPIを使用してユーザー情報を取得してdataに格納する。
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
@import "@/sass/common.sass"

#user
  text-align: left
  .row
    margin-bottom: 0.5rem

.default-input
  max-width: 289px
</style>
