<template lang='pug'>
  #work-time-input
    .home
      // #topic
      // メソッドを渡したい場合は@で渡す。ここだと@day-clickのこと
      // Calendarコンポーネント側の$emit('day-click', ...args);という処理で渡したメソッドを実行してくれる
      Calendar(:default-view='viewType' :custom-buttons='customButtons' :footer='footer' :events='events' :config='config' @day-click='dayClick')

    #input-modal.modal(tabindex='-1' role='dialog')
      .modal-dialog(role='document')
        .modal-content
          .modal-header
            h5.modal-title 勤怠時間入力
            button.close(type='button' data-dismiss='modal' aria-label='Close')
              i.fas.fa-times
          .modal-body.container
            .form-row
              .col-6.form-group
                label(for='start-time') 開始時刻
                input#start-time.form-control.work-time(type='time' step="900" v-model='startTime')
              .col-6.form-group
                label(for='end-time') 終了時刻
                input#end-time.form-control.work-time(type='time' step="900" v-model='endTime')
            .form-row
              .col-8.form-group
                label(for="work-type") 勤怠種別
                select#work-type.form-control(v-model="workType")
                  option(v-for="[key, value] in Array.from(workTypeMap)" value="key") {{ value }}
          .modal-footer
            button.btn.btn-primary(type='button' v-on:click='registor()') 登録
            button.btn.btn-secondary(type='button' data-dismiss='modal') キャンセル
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import Bootstrap from 'bootstrap';
import { ModalOption } from 'bootstrap';
import { DateUtility as dUtil } from '@/utility/DateUtility';
import Calendar from '@/components/Calendar.vue'; // @ is an alias to /src

/**
 * 勤怠入力カレンダーコンポーネント
 * #topic
 * tsでのvueの書き方は以下を参考にした
 * https://mae.chab.in/archives/60167
 */
@Component({
  components: {
    Calendar,
  },
})
export default class CalendarSample extends Vue {

  // 勤怠種別のMAP
  private readonly workTypeMap: Map<string, string> = new Map([
      ['0', '出社'],
      ['1', '有休(1.0)'], ['2', '有休(0.5)'],
      ['3', '代休(1.0)'], ['4', '代休(0.5)'],
      ['5', '他休(1.0)'], ['6', '他休(0.5)'],
      ['7', '特休(1.0)'], ['8', '特休(0.5)'],
      ['9', '振休(1.0)'],
  ]);

  /**
   * vue data
   */
  // カレンダー表示形式
  private viewType: string = 'month';
  // カスタムボタンと、カスタムボタンを配置するフッター
  private footer: object = {
    left: 'month, agendaWeek, listWeek, basicWeek, timelineDay, agendaDay',
    center: '',
    right: 'inputAllDefaultBtn exportExcel',
  };
  private customButtons: object = {
    inputAllDefaultBtn: {
      text: '定時一括入力',
      click: () => {
        alert('clicked the custom button!');
      },
    },
    exportExcel: {
      text: 'Excel出力',
      click: () => {
        alert('clicked the custom button!');
      },
    },
  };
  // 予定
  // TODO ここをAPIから取得してくるのが良い。きっとjsonで取得して、objectに変換してカレンダーに渡すイメージ
  private events: object[] = [
    {
      title: '出社',
      start: '2018-11-15T09:00:00.000',
      end: '2018-11-15T18:00:00.000',
    },
    {
      title: '出社',
      start: '2018-11-16T09:00:00.000',
      end: '2018-11-16T18:00:00.000',
    },
  ];
  // その他の設定情報
  private config: object = {
    // ロケーション
    locale: 'ja',
    // イベントの色
    eventColor: '#0000FF',
    // 終了時刻表示の有効/無効
    displayEventEnd: true,
    // BOOTSTRAP4テーマで描画する
    themeSystem: 'bootstrap4',
  };

  // 日付押下した年月日
  private year: string = '';
  private month: string = '';
  private date: string = '';

  // ダイアログで入力した日時(開始/終了)
  private startTime: string = '09:00';
  private endTime: string = '18:00';
  // 勤怠種別
  private workType: string = '';

  /**
   * カレンダーの日付押下処理
   * モーダルを表示する
   */
  private dayClick(clickDay: string, jsEvent: any, view: any): void {
    // 日付文字列を作成する
    const dateTime: Date = new Date(clickDay);
    this.year = dUtil.createYearString(dateTime);
    this.month = dUtil.createMonthString(dateTime);
    this.date = dUtil.createDateString(dateTime);

    // ダイアログで勤怠時間を入力
    const option: ModalOption = { backdrop: true, keyboard: true, focus: true, show: true };
    $('#input-modal').modal('show');

    // TODO課題
    // * イベントが複数個作れてしまうので、1つしか作れないようにする方法を考える
    // * ダイアログから削除する機能も作る
  }

  /**
   * ダイアログの登録ボタン押下処理
   * 予定の追加を行う
   */
  private registor() {
    // Calendarコンポーネントでは、eventプロパティをwatchしているので、値を変えると再描画してくれる
    this.events.push({
      title: '出社',
      start: `${this.year}-${this.month}-${this.date}T${this.startTime}:00.000`,
      end: `${this.year}-${this.month}-${this.date}T${this.endTime}:00.000`,
    });

    // 使い終わったら開始/終了時刻を初期化する
    this.startTime = '09:00';
    this.endTime = '18:00';

    // ダイアログを閉じる
    $('#input-modal').modal('hide');
  }
}
</script>

<style scoped lang='sass'>
// #topic
// node_modulesのCSSを使用する場合はimportで対応する。
@import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'

#input-modal
  .form-group
    text-align: left
  .work-time
    max-width: 340px
    height: 60px
    font-size: 32px

</style>