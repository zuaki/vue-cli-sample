import { Event } from '@/model/Event';
import { WorkTimeCheckError } from '@/model/WorkTimeCheckError';

/**
 * 勤怠チェック機能インターフェース
 */
export interface IWorkTimeCheck {
  /**
   * 勤怠チェックの種別を選んだ際にその月の全予定に対してチェックを行う
   * エラーがあればエラーオブジェクトを返す
   * エラーがなければundefinedを返す
   *
   * @param events チェック対象の予定の配列
   * @returns 勤怠チェック結果
   */
  checkMonth(events: Event[]): WorkTimeCheckError[] | undefined;

  /**
   * 勤怠入力時に入力した日に対してチェックを行う
   * エラーがあればエラーオブジェクトを返す
   * エラーがなければundefinedを返す
   *
   * @param event チェック対象のイベント
   * @returns 勤怠チェック結果
   */
  checkDay(event: Event): WorkTimeCheckError[] | undefined;
}
