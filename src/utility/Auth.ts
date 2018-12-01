class Auth {
  /** ログインしているか否か */
  private loggedIn: boolean = false;

  public get _loggedIn(): boolean {
    return this.loggedIn;
  }

  /**
   * ログイン処理
   */
  public login(name: string, password: string): void {
    // TODO RESTAPIにログイン処理可否の判断は委譲する
    this.loggedIn = true;
  }

  /**
   * ログアウト処理
   */
  public logout(): void {
    this.loggedIn = false;
  }
}
