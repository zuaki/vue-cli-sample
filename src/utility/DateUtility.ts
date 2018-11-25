/**
 * 日付操作ユーティリティ
 */
export class DateUtility {
  /**
   * 年月日を文字列型で返す
   * 形式はyyyy-mm-dd
   * @param day 日時
   */
  public static createFullDateString(day: Date): string {
    const year: string = this.createYearString(day);
    const month: string = this.createMonthString(day);
    const date: string = this.createDateString(day);

    return `${year}-${month}-${date}`;
  }

  /**
   * 年を文字列型で返す
   * @param day 日時
   */
  public static createYearString(day: Date) {
    return day.getFullYear().toString();
  }

  /**
   * 月を文字列型で返す
   * 1桁の場合は頭に0埋めする
   * @param day 日時
   */
  public static createMonthString(day: Date) {
    const month = day.getMonth() + 1;
    let monthStr: string;
    if (month.toString().length === 1) {
      monthStr = '0' + month.toString();
    } else {
      monthStr = month.toString();
    }
    return monthStr;
  }

  /**
   * 日を文字列型で返す
   * 1桁の場合は頭に0埋めする
   * @param day 日時
   */
  public static createDateString(day: Date) {
    const date = day.getDate();
    let dateStr: string;
    if (date.toString().length === 1) {
      dateStr = '0' + date.toString();
    } else {
      dateStr = date.toString();
    }
    return dateStr;
  }

  /**
   * 時を文字列型で返す
   * 1桁の場合は頭に0埋めする
   * @param day 日時
   */
  public static createHoursString(day: Date) {
    const hours = day.getHours();
    let hoursStr: string;
    if (hours.toString().length === 1) {
      hoursStr = '0' + hours.toString();
    } else {
      hoursStr = hours.toString();
    }
    return hoursStr;
  }

  /**
   * 分を文字列型で返す
   * 1桁の場合は頭に0埋めする
   * @param day 日時
   */
  public static createMinutesString(day: Date) {
    const minutes = day.getMinutes();
    let minutesStr: string;
    if (minutes.toString().length === 1) {
      minutesStr = '0' + minutes.toString();
    } else {
      minutesStr = minutes.toString();
    }
    return minutesStr;
  }

  /**
   * 秒を文字列型で返す
   * 1桁の場合は頭に0埋めする
   * @param day 日時
   */
  public static createSecondsString(day: Date) {
    const seconds = day.getSeconds();
    let secondsStr: string;
    if (seconds.toString().length === 1) {
      secondsStr = '0' + seconds.toString();
    } else {
      secondsStr = seconds.toString();
    }
    return secondsStr;
  }
}
