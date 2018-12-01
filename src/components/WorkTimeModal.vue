<template lang="pug">
// 勤怠入力モーダル
#work-time-modal.modal(tabindex="-1" role="dialog")
  .modal-dialog.shadow-lg(role="document")
    .modal-content
      .modal-header.bg-dark
        h5#displayDate.modal-title
        button.close(type="button" aria-label="Close" v-on:click="cancelEvent()")
          i.fas.fa-times
      .modal-body.container
        .form-row
          .col-6.form-group
            label(for="start-time") 開始時刻
            input#start-time.form-control.work-time(type="time" step="900" v-model="workTime.startTime")
          .col-6.form-group
            label(for="end-time") 終了時刻
            input#end-time.form-control.work-time(type="time" step="900" v-model="workTime.endTime")
        .form-row
          .col-8.form-group
            label(for="work-type") 勤怠種別
            select#work-type.form-control(v-model="workTime.workType")
              option(v-for="[key, value] in Array.from(workTypeMap)" v-bind:value="key") {{ value }}
        .form-ro
          .conl-12.form-group
            label(for="memo") 備考
            textarea#memo.form-control(v-model="workTime.memo")
      .modal-footer
        button.btn.btn-gray-primary(type="button" v-on:click="addEvent(false)") 登録
        button.btn.btn-gray-primary(type="button" v-on:click="deleteEvent()") 削除
        button.btn.btn-gray-primary(type="button" v-on:click="cancelEvent()") キャンセル
      #input-error-alerm.modal-footer
        .card.card-body
          .text-sm-left
            p
              strong.text-danger 勤怠チェックでエラーが発生しました
            div 
              strong 対応
              ul 
                li エラー内容を確認して修正後、再度「登録」を行う
                li エラーを無視して「強制登録」を行う
            div
              strong エラー内容
              ul
                li(v-for="error in workTimeErrors") {{ error.message }} 
          .text-center
            button.btn.btn-sm.btn-danger(type="button" v-on:click="addEvent(true)" style="width:120px;") 強制登録
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import Bootstrap from 'bootstrap';
import { WorkTime } from '@/model/WorkTime';
import { WorkTimeCheckError } from '@/model/WorkTimeCheckError';

/**
 * 勤怠入力モーダルコンポーネント
 */
@Component
export default class WorkTimeModal extends Vue {

  /** 勤怠種別のMAP */
  @Prop()
  private workTypeMap!: Map<string, string>;

  /** 勤怠情報 */
  private workTime: WorkTime = new WorkTime();
  /** 勤怠入力エラー ダイアログに表示するエラー情報を保持する */
  private workTimeErrors: WorkTimeCheckError[] = [];

  /**
   * モーダルダイアログの表示
   * 親コンポーネントから呼び出される
   * #topic
   * 親コンポーネントから呼び出される処理はpublicで宣言し、
   * 自コンポーネントでのみ呼び出される処理はprivateで宣言する
   */
  public show(workTime: WorkTime): void {
    this.workTime = workTime;

    // 表示用の日付を作る
    // refsの場合、ArrayやObject以外は値変更の監視をしていないので、表示用の情報ならjQueryで切替える
    let displayDate: string = this.workTime.date;
    displayDate = displayDate.replace('-', '年 ');
    displayDate = displayDate.replace('-', '月 ');
    displayDate = displayDate + '日';
    $('#displayDate').text(displayDate);

    $('#input-error-alerm').hide();
    $('#work-time-modal').modal('show');

    return;
  }

  /**
   * モーダルダイアログのエラーを表示
   * 親コンポーネントから呼び出される
   */
  public showErrors(workTimeErrors: WorkTimeCheckError[]): void {
    this.workTimeErrors = workTimeErrors;
    $('#input-error-alerm').show();

    return;
  }

  /**
   * モーダルダイアログの非表示
   * 親コンポーネントから呼び出される
   */
  public hide(): void {
    $('#work-time-modal').modal('hide');

    return;
  }

  /**
   * 登録ボタン押下処理
   */
  private addEvent(isForced: boolean): void {
    this.$emit('add-event', isForced, this.workTime);

    return;
  }

  /**
   * 削除ボタン押下処理
   */
  private deleteEvent(): void {
    this.$emit('delete-event', this.workTime);

    return;
  }

  /**
   * キャンセルボタン押下処理
   */
  private cancelEvent(): void {
    this.$emit('cancel-event');

    return;
  }
}
</script>

<style lang="sass" scoped>
#work-time-modal
  .form-group
    text-align: left
  .work-time
    max-width: 340px
    height: 60px
    font-size: 32px
  .modal-header
    color: #fff
  .close
    color: #fff
</style>