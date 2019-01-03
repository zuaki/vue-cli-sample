<template lang="pug">
#work-time-input
  Navigation

  #work-time.card.shadow-lg
    .card-header.bg-dark
    .card-body
      // #topic
      // 子コンポーネントのpropsのプロパティ名がcustomButtonsなら、「custom-buttons」として渡す必要がある
      // 理由は、HTMLの属性名はキャメルケースを理解できず、「customButtons」と「custombuttons」が区別できないため
      // vuejsがケバブケースからキャメルケースに翻訳して変数名を解釈している
      // #topic
      // メソッドを渡したい場合は@で渡す。ここだと@day-clickのこと
      // Calendarコンポーネント側の$emit("day-click", ...args);という処理で渡したメソッドを実行してくれる
      Calendar(:default-view="viewType" :selectable="selectable" :editable="editable" :custom-buttons="customButtons" :footer="footer" :events="events" :config="config" :add-css-class="addCssClass" :remove-css-class="removeCssClass" @view-render="viewRender" @day-click="dayClick" @event-selected="eventSelected")

  // #topic
  // 子コンポーネントにv-modelをつけると、親子間でプロパティを双方向バインディングできる
  // 今回モーダルは1つのコンポーネントを使いまわすので、値の書換えを親から実行するため使用する
  WorkTimeModal(:default-start-time="defaultStartTime" :default-end-time="defaultEndTime" ref="modal" @add-event="addEvent" @delete-event="deleteEvent" @cancel-event="cancelEvent")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Bootstrap from "bootstrap";
import { ModalOption } from "bootstrap";
import { WorkTimeConstants as wConst } from "@/constants/WorkTime";
import { Event } from "@/model/Event";
import { WorkTime } from "@/model/WorkTime";
import { WorkTimeCheckError } from "@/model/WorkTimeCheckError";
import { DateUtility as dUtil } from "@/utility/DateUtility";
import { WorkTimeCheckAny } from "@/utility/WorkTimeCheckAny";
import { IWorkTimeCheck } from "@/utility/IWorkTimeCheck";
import Calendar from "@/components/Calendar.vue";
import WorkTimeModal from "@/components/WorkTimeModal.vue";
import Navigation from "@/components/Navigation.vue";
import { unix } from "moment";

/**
 * 勤怠入力カレンダーコンポーネント
 * #topic
 * tsでのvueの書き方は以下を参考にした
 * https://mae.chab.in/archives/60167
 */
@Component({
  components: {
    Calendar,
    Navigation,
    WorkTimeModal,
  },
})
export default class WorkTimeInput extends Vue {

  /*******************************************
   * 定数
   *******************************************/
  /** 勤怠種別のMAP */
  private workTypeMap: Map<string, string> = wConst.WorkTypeMap;

  /** 勤怠種別毎のイベント色MAP */
  private eventColorMap: Map<string, string> = wConst.EventColorMap;

  /** 勤怠チェック処理は作業場毎に異なるので勤怠チェック実行クラスをMAPで持つ */
  private readonly workTimeCheckMap: Map<string, IWorkTimeCheck> = new Map([
    ["0", new WorkTimeCheckAny()],
  ]);

  // TODO この2つはREST APIから取得したほうが便利かも？
  /** 始業時刻定数値 */
  private readonly defaultStartTime: string = "09:00";
  /** 就業時刻定数値 */
  private readonly defaultEndTime: string = "18:00";

  /*******************************************
   * カレンダーコンポーネントに渡す設定値
   *******************************************/
  /** カレンダー表示形式 */
  private viewType: string = "month";

  /** 選択可否 */
  private selectable: boolean = false;

  /** ドラッグ等での予定情報編集可否 */
  private editable: boolean = false;

  /** フッター */
  private footer: object = {
    left: "",
    center: "",
    right: "inputAllDefaultBtn allCrearBtn exportExcel",
  };

  /** カスタムボタン */
  private customButtons: object = {
    inputAllDefaultBtn: {
      text: "定時一括入力",
      click: () => {
        this.inputAllDefault();
      },
    },
    allCrearBtn: {
      text: "一括クリア",
      click: () => {
        this.allCrear();
      },
    },
    exportExcel: {
      text: "Excel出力",
      click: () => {
        alert("clicked the custom button!");
      },
    },
  };

  /** その他の設定情報 */
  private config: object = {
    // ロケーション
    locale: "ja",
    // 終了時刻表示の有効/無効
    displayEventEnd: true,
    // BOOTSTRAP4テーマで描画する
    themeSystem: "bootstrap4",
  };

  /** CSS調整用 class追加 */
  private addCssClass: object[] = [
    {
      selector: ".fc-today-button",
      class: "btn-gray-primary",
    },
    {
      selector: ".fc-prev-button",
      class: "btn-gray-primary",
    },
    {
      selector: ".fc-next-button",
      class: "btn-gray-primary",
    },
    {
      selector: ".fc-inputAllDefaultBtn-button",
      class: "btn-gray-primary",
    },
    {
      selector: ".fc-allCrearBtn-button",
      class: "btn-gray-primary",
    },
    {
      selector: ".fc-exportExcel-button",
      class: "btn-gray-primary",
    },
  ];

  /** CSS調整用 class削除 */
  private removeCssClass: object[] = [
    {
      selector: ".fc-today-button",
      class: "btn-primary",
    },
    {
      selector: ".fc-prev-button",
      class: "btn-primary",
    },
    {
      selector: ".fc-next-button",
      class: "btn-primary",
    },
    {
      selector: ".fc-inputAllDefaultBtn-button",
      class: "btn-primary",
    },
    {
      selector: ".fc-allCrearBtn-button",
      class: "btn-primary",
    },
    {
      selector: ".fc-exportExcel-button",
      class: "btn-primary",
    },
  ];

  /**
   * 予定
   * 予定はカレンダーコンポーネントに渡すが、このコンポーネントでも値変更する
   */
  private events: Event[] = [];

  /*******************************************
   * 一時使用プロパティ
   * ※実際にはmounted()で初期化するが、lint警告が出るので空文字入れる
   *******************************************/
  /** モーダル、イベント登録で使用する勤怠時間 */
  private workTime: WorkTime = new WorkTime();
  /** 勤怠チェック種別 勤怠チェック処理のMAPのキー値を保持する */
  private workTimeCheckType!: string;

  /**
   * viewサイクルのcreated時の実行処理
   * constructorだと表示不正等が起きるので、ここで初期化処理をする
   */
  private created(): void {
    // TODO 勤怠チェック種別はAPIから取得できるようにする
    this.workTimeCheckType = "0";
    this.initTempProperty();

    return;
  }

  /**
   * ダイアログ等で使用する一時使用プロパティの初期化
   */
  private initTempProperty(): void {
    this.workTime.setWorkTime("", this.defaultStartTime, this.defaultEndTime, "", "0");

    return;
  }

  /**
   * 勤怠入力カレンダーのview描画処理
   * 画面に表示するeventsを初期化する
   * 勤怠情報は月単位で管理したいため、月を移動したらeventsは初期化している
   *
   * このfunctionは初回描画時、月移動(prev、next)をしたときに呼ばれる
   * prev()とnext()をフックするコールバックは無いので、eventsにfunctionを渡す方法でフックする方法があるが
   * functionを渡すとpropでeventsを渡せないのでviewRender()でイベントの初期化をしている
   */
  private viewRender(): void {
    // TODO このタイミングでイベントを作る
    // APIから取得してくるのが良い。jsonで取得して、objectに変換してeventsに詰め込む
    // 月の移動を行った場合にもeventsは作り直すので、ここで取り直すのが良い
    this.events = [];

    return;
  }

  /**
   * カレンダーの日付押下処理
   * モーダルを表示する
   */
  private dayClick(clickDay: string, jsEvent: any, view: any): void {
    // 日付文字列を作成する
    const date: Date = new Date(clickDay);
    this.workTime.date = dUtil.createFullDateString(date);

    // すでに予定が入力されている場合はダイアログ表示前に初期値を格納しておく
    const index: number | undefined = this.getEventIndex(`${this.workTime.date}`);
    if (index !== undefined) {
      this.workTime.startTime = this.events[index].startTime;
      this.workTime.endTime = this.events[index].endTime;
      this.workTime.workType = this.events[index].workType;
      this.workTime.memo = this.events[index].memo;
    }

    // ダイアログで勤怠時間を入力
    // #topic
    // templateで子コンポーネントに「ref=<componentName>」を付与した場合、$refs.componentNameでインスタンスが取得できる
    // 取得した子コンポーネントのメソッドは呼び出しできる
    // 複数型が取りえるので、特定してからメソッドを呼び出さないとコンパイルエラーになるので注意
    const modal: WorkTimeModal | Vue | Element | Vue[] | Element[] = this.$refs.modal;
    if (modal instanceof WorkTimeModal) {
      modal.show(this.workTime);
    }

    return;
  }

  /**
   * 予定の押下処理
   * 日付の押下イベントと同様の処理
   *
   * @param event 予定オブジェト
   * @param jsEvent jsイベント
   * @param view 画面view
   */
  private eventSelected(event: Event, jsEvent: any, view: any): void {
    // 予定押下時はEventオブジェクトが引数で渡されるので、その中の日付だけ使う
    this.dayClick(event.date, jsEvent, view);

    return;
  }

  /**
   * ダイアログの登録ボタン押下処理
   * 予定の追加を行う
   *
   * 登録時に勤怠チェックを行うが、チェックエラーだとしても強制登録できる必要がある
   * (特例でチェック違反でもOKのパターンへの考慮)
   * 勤怠チェックエラーの場合はエラー内容と強制登録ボタンを表示させ、エラーを無視して登録できるようにする
   *
   * @param isForced 強制的に登録するか否か
   */
  private addEvent(isForced: boolean, inputedWorkTime: WorkTime): void {
    // 登録用のイベントを作る
    const event: Event = this.createEvent(inputedWorkTime.workType, inputedWorkTime.date, inputedWorkTime.startTime, inputedWorkTime.endTime, inputedWorkTime.memo);

    // 強制登録でなく、チェッククラスが存在する場合は勤怠チェックする
    const checker: IWorkTimeCheck | undefined = this.workTimeCheckMap.get(this.workTimeCheckType);
    if (!isForced && checker !== undefined) {
      // チェック結果が存在した場合は、エラー内容と強制登録ボタンを表示する
      const checkError: WorkTimeCheckError[] | undefined = checker.checkDay(event);
      if (checkError !== undefined) {

        const modal: WorkTimeModal | Vue | Element | Vue[] | Element[] = this.$refs.modal;
        if (modal instanceof WorkTimeModal) {
          modal.showErrors(checkError);
        }
        return;
      }
    }

    // すでに予定が入力されている場合は消してから登録する
    // 消さずに要素を差し替えようとすると表示が更新されないので一度消す必要がある
    const index: number | undefined = this.getEventIndex(`${inputedWorkTime.date}`);
    if (index !== undefined) {
      this.events.splice(index, 1);
    }
    this.events.push(event);

    this.finalizeModal();

    return;
  }

  /**
   * ダイアログの削除ボタン押下処理
   * 予定の削除を行う
   */
  private deleteEvent(inputedWorkTime: WorkTime): void {
    // 登録されている予定を削除する
    const index: number | undefined = this.getEventIndex(`${inputedWorkTime.date}`);
    if (index !== undefined) {
      this.events.splice(index, 1);
    }

    this.finalizeModal();

    return;
  }

  /**
   * ダイアログのキャンセルボタン押下処理
   * ダイアログの削除
   */
  private cancelEvent(): void {
    this.finalizeModal();

    return;
  }

  /**
   * ダイアログの終了処理
   */
  private finalizeModal(): void {
    // ダイアログは使いまわすので、共通で使用するプロパティを初期化する
    this.initTempProperty();
    const modal: WorkTimeModal | Vue | Element | Vue[] | Element[] = this.$refs.modal;
    if (modal instanceof WorkTimeModal) {
      modal.hide();
    }

    return;
  }

  /**
   * 勤怠一括入力
   * 平日に定数定義している勤怠時間で一括で予定を作る
   * 既に入力されている場合は入力しない
   */
  private inputAllDefault(): void {
    // 月の日数を調べる場合、指定した月の次の月の0日目は, 指定した月の最終日が返ってくる
    const today: Date = new Date();
    const year: number = today.getFullYear();
    const month: number = today.getMonth();
    const dayLength: number = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < dayLength + 1; i++) {
      // イベント登録用に0埋めした年月日の文字列を作る
      const date: Date = new Date(year, month, i);
      const dateStr = dUtil.createFullDateString(date);

      if (this.getEventIndex(dateStr) !== undefined) {
        continue;
      }

      if (date.getDay() !== 0 && date.getDay() !== 6) {
        const event: Event = this.createEvent("0", dateStr, this.defaultStartTime, this.defaultEndTime, "");
        this.events.push(event);

        // TODO REST SPIをコールしてその日付の情報を追加
      }
    }

    return;
  }

  /**
   * 一括クリア
   * 現在ページの勤怠を一括クリアする
   */
  private allCrear(): void {
    // 月の日数を調べる場合、指定した月の次の月の0日目は, 指定した月の最終日が返ってくる
    const today: Date = new Date();
    const year: number = today.getFullYear();
    const month: number = today.getMonth();
    const dayLength: number = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < dayLength + 1; i++) {
      // イベント削除用に0埋めした年月日の文字列を作る
      const date: Date = new Date(year, month, i);
      const dateStr = dUtil.createFullDateString(date);

      const index: number | undefined = this.getEventIndex(dateStr);
      if (index === undefined) {
        continue;
      }

      this.events.splice(index, 1);

      // TODO REST SPIをコールしてその日付の情報を削除
    }

    return;
  }

  /**
   * 勤怠Excelファイルの出力
   *
   * REST APIにexcelファイル作成要求を出す
   * ※ダウンロードといっても、レスポンスヘッダのContent-Typeが適切に設定されて、
   * レスポンスボディにファイルの中身が入っていれば良いので通常のリクエストと同じ
   */
  private outputExcel(): void {

    // TODO Ajax通信

    return;
  }

  /**
   * 予定の作成
   *
   * @param workType 勤怠種別
   * @param date 日付文字列 yyyy-mm-ddの形式
   * @param startTime 開始時刻文字列 hh:mmの形式
   * @param endTime 終了時刻文字列 hh:mmの形式
   * @param memo 備考
   * @returns 予定
   */
  private createEvent(workType: string, date: string, startTime: string, endTime: string, memo: string): Event {
    const event: Event = new Event(
      this.workTypeMap.get(workType),
      `${date}T${startTime}:00.000`,
      `${date}T${endTime}:00.000`,
      this.eventColorMap.get(workType),
      `${date}`,
      workType,
      startTime,
      endTime,
      memo,
    );

    return event;
  }

  /**
   * dateの値で予定を検索し、存在すればインデックスを返す
   * 存在しない場合はundefinedを返す
   *
   * @param date yyyy-mm-ddの形式の日付文字列
   */
  private getEventIndex(date: string): number | undefined {
    for (let i: number = 0; i < this.events.length; i++) {
      if (this.events[i].date === date) {
        return i;
      }
    }
    return undefined;
  }
}
</script>

<style scoped lang="sass">
@import "@/sass/common.sass"

#work-time-input
  #work-time
    @include common-contents

  // #topic
  // styleでscopedを使用していて、子コンポーネントのスタイルに影響を与えたい場合は、deepを使う
  // 以下のように書くと「子コンポーネントの#calendarに対して」スタイルを適用させることができる
  /deep/ #calendar
    .fc-view-container
      background-color: #fff
    .fc-sun
      color: red
      background-color: rgba(234, 199, 205, .3)
    .fc-sat
      color: blue
      background-color: rgba(165, 209, 244, .3)
    .fc-mon, .fc-tue, .fc-wed, .fc-thu, .fc-fri
      background-color: rgba(250, 250, 250, .3)
    .fc-today
      background-color: rgba(255, 180, 90, .3)
    .table-bordered td, .table-bordered th
      border: solid 1px rgba(100, 100, 130, .5)
    .fc-day-top
      border: solid 1px rgba(100, 100, 130, .5)
</style>