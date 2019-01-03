<template lang="pug">
  #calendar(ref="calendar")
</template>

<script lang="ts">
import { Component, Prop, Watch, Emit, Vue } from "vue-property-decorator";

import defaultsDeep from "lodash.defaultsdeep";
import "fullcalendar";
import "fullcalendar/dist/locale/ja";

@Component
export default class Calendar extends Vue {

  /**
   * 基本的にfullcalendarの設定で使用するものをpropsで受け取れるようにしている
   * そのため、各プロパティの意味については以下を参照
   * https://fullcalendar.io/docs#toc
   */
  // #topic
  // propのデフォルト値は定義した際に格納するのではなく、@Prop()に{default: "default value"}として書く
  // こうしないと親コンポーネントから渡された値が上書きされてしまう
  @Prop({ default: [] })
  private events!: any[];
  // http://blog.eszett-design.com/2012/08/fullcalendar.html
  @Prop({ default: [] })
  private eventSources!: any[];
  // カレンダー上のイベント(予定)変更の有効/無効
  @Prop({ default: true })
  private editable!: boolean;
  // 要素の選択の有効/無効
  @Prop({ default: true })
  private selectable!: boolean;
  // 要素のドラッグ時にイベントをフックするHelperの有効/無効
  @Prop({ default: true })
  private selectHelper!: boolean;
  // ヘッダー部の設定
  @Prop({ default: { left: "title", center: "", right: "today prev,next" } })
  private header!: any;
  // フッター部の設定
  @Prop({ default: {} })
  private footer!: any;
  // カスタムボタンの設定
  @Prop({ default: {} })
  private customButtons!: any;
  // 初期表示の形式
  // month, agendaWeek, listWeek, basicWeek, timelineDay, agendaDay
  @Prop({ default: "month" })
  private defaultView!: string;
  // TODO 未調査
  @Prop({ default: false })
  private sync!: boolean;
  // その他設定情報
  @Prop({ default: {} })
  private config!: object;
  // CSS調整用 追加対象CSSクラス
  @Prop({ default: [] })
  private addCssClass!: any[];
  // CSS調整用 削除対象CSSクラス
  @Prop({ default: [] })
  private removeCssClass!: any[];


  /**
   * 親コンポーネントからこのメソッドを呼び出すことでfullcalendarの処理呼び出しを行えるようにする
   * 親コンポーネントから
   * <Calendar ref="calendar" />
   * と定義したカレンダーに対してビジネスロジックで
   * this.$refs.calendar.fireMethod("next")
   * と呼び出す
   *
   * TODO Typescript化してから実験する
   */
  public fireMethod(...options: any[]) {
    return $(this.$el).fullCalendar(...options);
  }

  /**
   * vue lifecycle mounted
   */
  private mounted(): void {
    this.$on("remove-event", (event: any) => {
      if (event && event.hasOwnProperty("id")) {
        $(this.$el).fullCalendar("removeEvents", event.id);
      } else {
        $(this.$el).fullCalendar("removeEvents", event);
      }
    });

    this.$on("rerender-events", () => {
      $(this.$el).fullCalendar("rerenderEvents");
    });

    this.$on("refetch-events", () => {
      $(this.$el).fullCalendar("refetchEvents");
    });

    this.$on("render-event", (event: any) => {
      $(this.$el).fullCalendar("renderEvent", event);
    });

    this.$on("reload-events", () => {
      $(this.$el).fullCalendar("removeEvents");
      $(this.$el).fullCalendar("addEventSource", this.events);
    });

    this.$on("rebuild-sources", () => {
      $(this.$el).fullCalendar("removeEventSources", "");
      this.eventSources.map((event) => {
        $(this.$el).fullCalendar("addEventSource", event);
      });
    });

    // カレンダーのhtmlが作られるのはcal.fullCalendar()
    // 表示状態でカレンダーが作られると、後続処理のCSS調整で瞬間的にチラつきが発生するので、
    // 非表示状態でカレンダーを作る
    $("#calendar").hide();

    const configs: any = defaultsDeep(this.config, this.defaultConfig);
    $(this.$el).fullCalendar(configs);

    // CSS調整 CSSクラス追加
    for (const rm of this.removeCssClass) {
      $(rm.selector).removeClass(rm.class);
    }

    // CSS調整 CSSクラス削除
    for (const add of this.addCssClass) {
      $(add.selector).addClass(add.class);
    }

    // CSS調整が終わったのでカレンダーを表示する
    $("#calendar").show();
  }

  /**
   * vue lifecycle beforeDestroy
   */
  private beforeDestroy(): void {
    this.$off("remove-event");
    this.$off("rerender-events");
    this.$off("refetch-events");
    this.$off("render-event");
    this.$off("reload-events");
    this.$off("rebuild-sources");
  }

  /**
   * FullCalendar設定情報返却
   */
  get defaultConfig(): any {

    const configs: any = {
      header: this.header,
      footer: this.footer,
      customButtons: this.customButtons,
      defaultView: this.defaultView,
      editable: this.editable,
      selectable: this.selectable,
      selectHelper: this.selectHelper,
      aspectRatio: 2,
      timeFormat: "HH:mm",
      events: this.events,
      eventSources: this.eventSources,
      /** FullCalendarが呼び出すメソッドを渡す */
      eventRender: this.eventRender,
      viewRender: this.viewRender,
      eventDestroy: this.eventDestroy,
      eventClick: this.eventClick,
      eventDrop: this.eventDrop,
      eventReceive: this.eventReceive,
      eventResize: this.eventResize,
      eventDragStart: this.eventDragStart,
      eventDragStop: this.eventDragStop,
      dayClick: this.dayClick,
      select: this.select,
    };

    return configs;
  }

  private eventRender(...args: any[]): void {
    if (this.sync) {
      this.events = $(this.$el).fullCalendar("clientEvents", {});
    }
    this.$emit("event-render", ...args);
    return;
  }

  private viewRender(...args: any[]): void {
    if (this.sync) {
      this.events = $(this.$el).fullCalendar("clientEvents", {});
    }
    this.$emit("view-render", ...args);
    return;
  }

  private eventDestroy(event: any[]): void {
    if (this.sync) {
      this.events = $(this.$el).fullCalendar("clientEvents", {});
    }
    return;
  }

  @Emit("event-drag-start")
  private eventDragStart(...args: any[]): void { return; }

  /**
   * 予定要素のクリックイベント処理
   * #topic
   * 条件分岐がなく、$emitするだけなのであれば、簡略化して書ける。
   */
  @Emit("event-selected")
  private eventClick(...args: any[]): void { return; }

  @Emit("event-drop")
  private eventDrop(...args: any[]): void { return; }

  @Emit("event-receive")
  private eventReceive(...args: any[]): void { return; }

  @Emit("event-resize")
  private eventResize(...args: any[]): void { return; }

  @Emit("event-drag-stop")
  private eventDragStop(...args: any[]): void { return; }

  /**
   * 日付要素のクリックイベント処理
   * #topic
   * 親コンポーネントから渡されたdayClick()をコールする
   * 親コンポーネントから@day-click="dayClick"でメソッドを渡さないといけないので注意
   */
  private dayClick(...args: any[]): void {
    // #topic
    // 「...args」は可変長引数(Spread operator)といい、n個のプロパティがあることを指します
    // 実際にはdayClick(date, jsEvent, view)となりますが、省略して「...args」と書くことも出来ます
    this.$emit("day-click", ...args);
    return;
  }

  /**
   * 日付、時刻要素のクリックイベント処理
   */
  private select(start: any, end: any, jsEvent: any, view: any, resource: any): void {
    this.$emit("event-created", {
      start,
      end,
      allDay: !start.hasTime() && !end.hasTime(),
      view,
      resource,
    });
    return;
  }

  /**
   * 値の監視
   */
  @Watch("events", { deep: true })
  private onEventsChange(newEvents: any[], oldEvents: any[]): void {
    $(this.$el).fullCalendar("removeEvents");
    $(this.$el).fullCalendar("addEventSource", newEvents);
    return;
  }

  /**
   * 値の監視
   */
  @Watch("eventSources")
  private onEventSourcesChange(): void {
    this.$emit("rebuild-sources");
    return;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
// #topic
// node_modulesのCSSを使用したい場合はimportで対応する。
@import "../../node_modules/fullcalendar/dist/fullcalendar.css"
@import "../../node_modules/@fortawesome/fontawesome-free/css/all.css"
</style>
