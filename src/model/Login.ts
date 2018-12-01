/**
 * ログイン情報
 */
export default class Login {
  /** ユーザーID */
  public name: string;

  /** パスワード */
  public password: string;

  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
  }
}
