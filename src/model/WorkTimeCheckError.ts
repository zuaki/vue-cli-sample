import { Event } from "@/model/Event";

/**
 * 勤怠チェックエラー
 */
export class WorkTimeCheckError {
  /** メッセージ */
  private message: string | undefined;
  /** 勤怠チェックエラーが発生したEvent */
  private event: Event | undefined;
  /** チェックエラーが発生したEvent内のプロパティ */
  private errorProperty: string | undefined;

  constructor(
    message: string | undefined,
    event: Event | undefined,
    errorProperty: string | undefined,
  ) {
    this.message = message;
    this.event = event;
    this.errorProperty = errorProperty;
  }

  get _message(): string | undefined {
    return this.message;
  }
  set _message(message: string | undefined) {
    this.message = message;
  }
  get _event(): Event | undefined {
    return this.event;
  }
  set _event(event: Event | undefined) {
    this.event = event;
  }
  get _errorProperty(): string | undefined {
    return this.errorProperty;
  }
  set _errorProperty(errorProperty: string | undefined) {
    this.errorProperty = errorProperty;
  }
}
