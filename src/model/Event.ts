/**
 * イベント(予定)
 */
export class Event {
  public title: string | undefined;
  public start: string;
  public end: string;
  public color: string | undefined;
  public date: string;
  public workType: string;
  public startTime: string;
  public endTime: string;
  public memo: string;

  private readonly defaultColor: string = '#0000FF';

  /**
   * コンストラクタ
   *
   * @param title fullcalendar表示用のイベント名
   * @param start fullcalendar表示用のイベント開始日時
   * @param end fullcalendar表示用のイベント終了日時
   * @param date 画面用の日付(yyyy-mm-dd形式)
   * @param workType 画面用の勤怠種別
   * @param startTime 画面用のイベント開始時刻
   * @param endTime 画面用のイベント終了時刻
   */
  constructor(
    title: string | undefined,
    start: string,
    end: string,
    color: string | undefined,
    date: string,
    workType: string,
    startTime: string,
    endTime: string,
    memo: string,
  ) {
    this.title = title;
    this.start = start;
    this.end = end;
    if (color === undefined) {
      this.color = this.defaultColor;
    } else {
      this.color = color;
    }
    this.date = date;
    this.workType = workType;
    this.startTime = startTime;
    this.endTime = endTime;
    this.memo = memo;
  }
}
