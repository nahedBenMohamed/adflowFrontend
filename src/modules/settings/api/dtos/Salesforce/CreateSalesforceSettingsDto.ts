export class CreateSalesforceSettingsDto {
  domain: string;
  key: string;
  secret: string;

  constructor({ domain, key, secret }: CreateSalesforceSettingsDto) {
    this.domain = domain;
    this.key = key;
    this.secret = secret;
  }
}
