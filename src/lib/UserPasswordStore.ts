type PasswordRecord = {
  password: string;
  expiresAt: number;
};

class UserPasswordStore {
  private storageItemKey = 'userPassword';

  private tenMinutesTTL = 10 * 60 * 1000;

  setPassword = (password: string) => {
    sessionStorage.setItem(
      this.storageItemKey,
      JSON.stringify({ password, expiresAt: new Date().getTime() + this.tenMinutesTTL })
    );

    setTimeout(() => {
      this.clearPassword();
    }, this.tenMinutesTTL);
  };

  getPassword = (): string => {
    const data = sessionStorage.getItem(this.storageItemKey);
    if (!data) {
      return '';
    }

    const parsedData: PasswordRecord = JSON.parse(data);
    if (parsedData.expiresAt < new Date().getTime()) {
      this.clearPassword();
      return '';
    }
    return parsedData.password;
  };

  clearPassword = (): void => {
    sessionStorage.removeItem(this.storageItemKey);
  };
}

export default new UserPasswordStore();
