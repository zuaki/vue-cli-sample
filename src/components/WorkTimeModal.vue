<template lang="pug">
// Work Time Modal
#work-time-modal.modal(tabindex="-1" role="dialog")
  .modal-dialog.shadow-lg(role="document")
    .modal-content
      // Modal Header
      .modal-header.bg-dark
        h5#displayDate.modal-title
        button.close(type="button" aria-label="Close" v-on:click="cancelEvent()")
          i.fas.fa-times
      // Modal Body
      .modal-body.container
        .form-row
          // Input Start Time
          .col-6.form-group
            label(for="start-time") 開始時刻
            input#start-time.form-control.work-time(type="time" step="900" v-model="workTime.startTime")
          // Input End Time
          .col-6.form-group
            label(for="end-time") 終了時刻
            input#end-time.form-control.work-time(type="time" step="900" v-model="workTime.endTime")
        .form-row
          // Input Work Type
          .col-8.form-group
            label(for="work-type") 勤怠種別
            select#work-type.form-control(v-model="workTime.workType")
              option(v-for="[key, value] in Array.from(workTypeMap)" v-bind:value="key") {{ value }}
        .form-row
          // Input Memo
          .col-12.form-group
            label(for="memo") 備考
            textarea#memo.form-control(v-model="workTime.memo")
      // Modal Footer
      .modal-footer
        // Buttons is Register, Delete, Cancel
        button.btn.btn-gray-primary(type="button" v-on:click="addEvent(false)") 登録
        button.btn.btn-gray-primary(type="button" v-on:click="deleteEvent()") 削除
        button.btn.btn-gray-primary(type="button" v-on:click="cancelEvent()") キャンセル
      // Modal Footer Error Text Area
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
                // Output For Error Message
                li(v-for="error in workTimeErrors") {{ error.message }} 
          .text-center
            // Button is Force Register
            button.btn.btn-sm.btn-danger(type="button" v-on:click="addEvent(true)" style="width:120px;") 強制登録
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import Bootstrap from "bootstrap";
import { WorkTime } from "@/model/WorkTime";
import { WorkTimeCheckError } from "@/model/WorkTimeCheckError";
import { WorkTimeConstants as wConst } from "@/constants/WorkTime";

/**
 * 勤怠入力モーダルコンポーネント
 */
@Component
export default class WorkTimeModal extends Vue {

  /** デフォルト開始時間 */
  @Prop()
  private defaultStartTime: string = "";
  /** デフォルト終了時間 */
  @Prop()
  private defaultEndTime: string = "";

  /** 勤怠種別のMAP */
  private workTypeMap: Map<string, string> = wConst.WorkTypeMap;
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
    displayDate = displayDate.replace("-", "年 ");
    displayDate = displayDate.replace("-", "月 ");
    displayDate = displayDate + "日";
    $("#displayDate").text(displayDate);

    $("#input-error-alerm").hide();
    $("#work-time-modal").modal("show");

    return;
  }

  /**
   * モーダルダイアログのエラーを表示
   * 親コンポーネントから呼び出される
   */
  public showErrors(workTimeErrors: WorkTimeCheckError[]): void {
    this.workTimeErrors = workTimeErrors;
    $("#input-error-alerm").show();

    return;
  }

  /**
   * モーダルダイアログの非表示
   * 親コンポーネントから呼び出される
   */
  public hide(): void {
    $("#work-time-modal").modal("hide");

    return;
  }

  /**
   * vue lifesycle mounted
   */
  private mounted() {
    // デフォルト開始時間、終了時間が存在しない場合はデフォルト値を入れる
    if (!this.defaultStartTime) {
      this.defaultStartTime = "09:00";
    }
    if (!this.defaultEndTime) {
      this.defaultEndTime = "18:00";
    }
  }

  /**
   * 登録ボタン押下処理
   */
  private addEvent(isForced: boolean): void {
    // TODO ここでAPIを使って勤怠登録

    // カレンダーの更新処理は親コンポーネントで行う
    // このコンポーネントの責務はあくまで勤怠情報入力であり、カレンダーの更新は責務外
    this.$emit("add-event", isForced, this.workTime);

    return;
  }

  /**
   * 削除ボタン押下処理
   */
  private deleteEvent(): void {
    // TODO ここでAPIを使って勤怠削除

    // カレンダーの更新処理は親コンポーネントで行う
    // このコンポーネントの責務はあくまで勤怠情報入力であり、カレンダーの更新は責務外
    this.$emit("delete-event", this.workTime);

    return;
  }

  /**
   * キャンセルボタン押下処理
   */
  private cancelEvent(): void {
    this.$emit("cancel-event");

    return;
  }

  /**
   * 開始時間が変更になった場合の処理
   * 必須入力の項目の強調
   * #topic
   * workTimeをウォッチして、中のプロパティ(開始時間、終了時間、勤怠種別)をまとめてチェックしたい
   * ところだが、workTimeを指定してウォッチした場合はworkTimeのインスタンスが作り直された時にしか
   * ウォッチメソッドが呼ばれないため、個別にする必要がある
   */
  @Watch("workTime.startTime")
  private onStartTimeChange(newStartTime: string, oldStartTime: string) {
    // 開始時間が「--:--」なら開始時間を強調
    if (!newStartTime) {
      $("#start-time").addClass("require");
    } else {
      $("#start-time").removeClass("require");
    }

    // 開始時間が標準開始時間以外なら備考を強調 または
    // 勤怠種別が「出社」以外は備考を強調
    if ((newStartTime && newStartTime !== this.defaultStartTime) || this.workTime.workType !== "0") {
      $("#memo").addClass("require");
    } else {
      $("#memo").removeClass("require");
    }

    return;
  }

  /**
   * 終了時間が変更になった場合の処理
   * 必須入力の項目の強調
   */
  @Watch("workTime.endTime")
  private onEndTimeChange(newEndTime: string, oldEndTime: string) {
    // 終了時間が「--:--」なら終了時間を強調
    if (!newEndTime) {
      $("#end-time").addClass("require");
    } else {
      $("#end-time").removeClass("require");
    }

    return;
  }

  /**
   * 勤怠種別が変更になった場合の処理
   * 必須入力の項目の強調
   */
  @Watch("workTime.workType")
  private onWorkTypeChange(newWorkType: string, oldWorkType: string) {
    // 開始時間が標準開始時間以外なら備考を強調 または
    // 勤怠種別が「出社」以外は備考を強調
    if ((this.workTime.startTime && this.workTime.startTime !== this.defaultStartTime) || newWorkType !== "0") {
      $("#memo").addClass("require");
    } else {
      $("#memo").removeClass("require");
    }

    return;
  }

}
</script>

<style lang="sass" scoped>
@import "@/sass/common.sass"

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
  .require
    background-color: #ffdddd
</style>