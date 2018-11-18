<template lang="pug">
  div#calendar(ref="calendar")
</template>

<script>
import defaultsDeep from 'lodash.defaultsdeep';
import 'fullcalendar';
import $ from 'jquery';
import ja from 'fullcalendar/dist/locale/ja';

/**
 * コンポーネントの定義
 * TypeScriptとの比較を理解するために、JavaScriptで書く
 */
export default {

  /**
   * propsは呼び出し元から渡すことのできる値の定義。
   * 呼び出し元でtemplateに<Calendar :defaultView="day">のように書くことで、propsの各プロパティに値を渡すことができる
   *
   * 基本的にfullcalendarの設定で使用するものをpropsで受け取れるようにしている
   * そのため、各プロパティの意味については以下を参照
   * https://fullcalendar.io/docs#toc
   */
  props: {
    // 表示するイベント(予定)
    // イベント情報は配列やjson等の方法で渡すことが可能
    // 以下を参照
    // https://fullcalendar.io/docs/event-data
    events: {
      default() {
        return [];
      },
    },
    // Googleカレンダー等の他カレンダーAPIとの連携時に使用する
    // 使用したい場合は以下を参照
    // http://blog.eszett-design.com/2012/08/fullcalendar.html
    eventSources: {
      default() {
        return [];
      },
    },
    // カレンダー上のイベント(予定)変更の有効/無効
    editable: {
      default() {
        return true;
      },
    },
    // 要素の選択の有効/無効
    selectable: {
      default() {
        return true;
      },
    },
    // 要素のドラッグ時にイベントをフックするHelperの有効/無効
    selectHelper: {
      default() {
        return true;
      },
    },
    // ヘッダー部の設定
    header: {
      default() {
        return {
          left: 'title',
          center: '',
          right: 'today prev,next',
        };
      },
    },
    // フッター部の設定
    footer: {
      type: Object,
      default() {
        return {};
      },
    },
    // カスタムボタン
    customButtons: {
      type: Object,
      default() {
        return {};
      },
    },
    // 初期表示の形式
    defaultView: {
      type: String,
      default() {
        // month, agendaWeek, listWeek, basicWeek, timelineDay, agendaDay
        return 'month';
      },
    },
    // TODO 未調査
    sync: {
      default() {
        return false;
      },
    },
    // その他設定情報
    config: {
      type: Object,
      default() {
        return {
          // ロケーション
          locale: ja,
        };
      },
    },
  },

  computed: {
    defaultConfig() {
      const self = this;
      return {
        header: this.header,
        footer: this.footer,
        customButtons: this.customButtons,
        defaultView: this.defaultView,
        editable: this.editable,
        selectable: this.selectable,
        selectHelper: this.selectHelper,
        aspectRatio: 2,
        timeFormat: 'HH:mm',
        events: this.events,
        eventSources: this.eventSources,

        eventRender(...args) {
          if (this.sync) {
            self.events = cal.fullCalendar('clientEvents');
          }
          self.$emit('event-render', ...args);
        },

        viewRender(...args) {
          if (this.sync) {
            self.events = cal.fullCalendar('clientEvents');
          }
          self.$emit('view-render', ...args);
        },

        eventDestroy(event) {
          if (this.sync) {
            self.events = cal.fullCalendar('clientEvents');
          }
        },

        eventClick(...args) {
          self.$emit('event-selected', ...args);
        },

        eventDrop(...args) {
          self.$emit('event-drop', ...args);
        },

        eventReceive(...args) {
          self.$emit('event-receive', ...args);
        },

        eventResize(...args) {
          self.$emit('event-resize', ...args);
        },

        // 日付要素のクリックイベント処理
        // #topic
        // 親コンポーネントから渡されたdayClick()をコールする
        // 親コンポーネントから@day-click="dayClick"でメソッドを渡さないといけないので注意
        dayClick(...args) {
          // #topic
          // 「...args」は可変長引数(Spread operator)といい、n個のプロパティがあることを指します
          // 実際にはdayClick(date, jsEvent, view)となりますが、省略して「...args」と書くことも出来ます
          self.$emit('day-click', ...args);
        },

        // 日付、時刻要素のクリックイベント処理
        select(start, end, jsEvent, view, resource) {
          self.$emit('event-created', {
            start,
            end,
            allDay: !start.hasTime() && !end.hasTime(),
            view,
            resource,
          });
        },
      };
    },
  },

  /**
   * カレンダーのマウント
   */
  mounted() {
    const cal = $(this.$el);
    self = this;

    this.$on('remove-event', (event) => {
      if (event && event.hasOwnProperty('id')) {
        $(this.$el).fullCalendar('removeEvents', event.id);
      } else {
        $(this.$el).fullCalendar('removeEvents', event);
      }
    });

    this.$on('rerender-events', () => {
      $(this.$el).fullCalendar('rerenderEvents');
    });

    this.$on('refetch-events', () => {
      $(this.$el).fullCalendar('refetchEvents');
    });

    this.$on('render-event', (event) => {
      $(this.$el).fullCalendar('renderEvent', event);
    });

    this.$on('reload-events', () => {
      $(this.$el).fullCalendar('removeEvents');
      $(this.$el).fullCalendar('addEventSource', this.events);
    });

    this.$on('rebuild-sources', () => {
      $(this.$el).fullCalendar('removeEventSources');
      this.eventSources.map((event) => {
        $(this.$el).fullCalendar('addEventSource', event);
      });
    });

    cal.fullCalendar(defaultsDeep(this.config, this.defaultConfig));
  },

  methods: {
    fireMethod(...options) {
      return $(this.$el).fullCalendar(...options);
    },
  },

  /**
   * 値の監視
   */
  watch: {
    // 表示するイベント(予定)の監視
    // 親コンポーネントからprops経由で渡されたイベント(予定)を監視している
    events: {
      deep: true,
      // #topic
      // 親コンポーネントでeventsを変更すればhandler()が呼ばれる
      // 引数のvalには変更後のeventsが格納されている
      // イベントをすべて消し、変更後のeventsを入れ直して再描画させる
      handler(val) {
        $(this.$el).fullCalendar('removeEvents');
        $(this.$el).fullCalendar('addEventSource', this.events);
      },
    },
    eventSources: {
      deep: true,
      handler(val) {
        this.$emit('rebuild-sources');
      },
    },
  },

  /**
   * インスタンス削除前イベント処理
   */
  beforeDestroy() {
    this.$off('remove-event');
    this.$off('rerender-events');
    this.$off('refetch-events');
    this.$off('render-event');
    this.$off('reload-events');
    this.$off('rebuild-sources');
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
// #topic
// node_modulesのCSSを使用する場合はimportで対応する。
@import '../../node_modules/fullcalendar/dist/fullcalendar.css'
@import '../../node_modules/@fortawesome/fontawesome-free/css/all.css'
#calendar
  margin-left: auto
  margin-right: auto
  width: 1024px
</style>
