type EmailRecord = {
  email: string;
  expiresAt: number;
};

class UserEmailStore {
  private storageItemKey = 'userEmail';

  private tenMinutesTTL = 10 * 60 * 1000;

  setEmail = (email: string) => {
    sessionStorage.setItem(
      this.storageItemKey,
      JSON.stringify({ email, expiresAt: new Date().getTime() + this.tenMinutesTTL })
    );

    setTimeout(() => {
      this.clearEmail();
    }, this.tenMinutesTTL);
  };

  getEmail = (): string => {
    const data = sessionStorage.getItem(this.storageItemKey);
    if (!data) {
      return '';
    }

    const parsedData: EmailRecord = JSON.parse(data);
    if (parsedData.expiresAt < new Date().getTime()) {
      this.clearEmail();
      return '';
    }
    return parsedData.email;
  };

  clearEmail = (): void => {
    sessionStorage.removeItem(this.storageItemKey);
  };
}

export default new UserEmailStore();
