/**
 * 勤怠時間情報
 */
export class WorkTime {
  /** 日付文字列(yyyy-mm-ddの形式) */
  public date: string;

  /** 開始時刻(hh:mmの形式) */
  public startTime: string;

  /** 終了時刻(hh:mmの形式) */
  public endTime: string;

  /** 備考 */
  public memo: string;

  /** 勤怠種別 勤怠種別のMAPのキー値を保持する */
  public workType: string;

  constructor() {
    this.date = "";
    this.startTime = "";
    this.endTime = "";
    this.memo = "";
    this.workType = "";
  }

  public setWorkTime(
    date: string,
    startTime: string,
    endTime: string,
    memo: string,
    workType: string,
  ) {
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.memo = memo;
    this.workType = workType;
  }
}
