<template lang="pug">
  div.home
    img(alt="Vue logo" src="../assets/logo.png")
    // #topic
    // 子コンポーネントのpropsのプロパティ名がmyMessageなら、「my-message」として渡す必要がある
    // 理由は、HTMLの属性名はキャメルケースを理解できず、「myMessage」と「mymessage」が区別できないため
    // vuejsがケバブケースからキャメルケースに翻訳して変数名を解釈している
    HelloWorld(:my-message="myMessage")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

// #topic
// @Compornent()はVue.component()と同義？
@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  // #topic
  // vueでの :data { return {msg: 'Hello World'} に相当する }
  // つまり、「data」は クラスのプロパティ になる
  private myMessage: string = 'Hello World';
}
</script>
