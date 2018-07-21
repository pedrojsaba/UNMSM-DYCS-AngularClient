export class AppUserClaim  {
    id = '';
    user = '';
    type = '';
    value = '';
    constructor(type: string, value: string) {
      this.type = type;
      this.value = value;
    }
}
