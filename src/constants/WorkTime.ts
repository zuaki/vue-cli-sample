/**
 * 勤怠関連定数
 */
export class WorkTimeConstants {
  /** 勤怠の種別 */
  public static WorkTypeMap: Map<string, string> = new Map([
    ['0', '出社'],
    ['10', '休日出勤'],
    ['1', '有休(1.0)'],
    ['2', '有休(0.5)'],
    ['3', '代休(1.0)'],
    ['4', '代休(0.5)'],
    ['5', '他休(1.0)'],
    ['6', '他休(0.5)'],
    ['7', '特休(1.0)'],
    ['8', '特休(0.5)'],
    ['9', '振休(1.0)'],
  ]);

  /** 勤怠種別毎のイベント色MAP */
  public static EventColorMap: Map<string, string> = new Map([
    ['0', '#0178bc'],
    ['10', '#0178bc'],
    ['1', '#009b85'],
    ['2', '#009b85'],
    ['3', '#009b85'],
    ['4', '#009b85'],
    ['5', '#b80e3b'],
    ['6', '#b80e3b'],
    ['7', '#e2c80f'],
    ['8', '#e2c80f'],
    ['9', '#009b85'],
  ]);

  /**
   * 勤怠チェックの名称MAP
   * key:勤怠チェック種別コード値
   * value:勤怠チェックの名称
   */
  public static WorkTimeCheckNameMap: Map<string, string> = new Map([
    ['0', '8H'],
    ['1', 'F1'],
    ['2', 'A1'],
    ['3', 'A2'],
    ['4', 'S1'],
    ['5', 'S2'],
    ['6', 'S3'],
  ]);
}