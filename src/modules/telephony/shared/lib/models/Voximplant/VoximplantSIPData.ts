import type { VoximplantSIPDataDto } from '../../../../api';

export class VoximplantSIPData {
  userName: string;
  domain: string;
  password: string;

  constructor({ userName, domain, password }: VoximplantSIPData) {
    this.userName = userName;
    this.domain = domain;
    this.password = password;
  }

  static fromDto(dto: VoximplantSIPDataDto): VoximplantSIPData {
    return new VoximplantSIPData({
      userName: dto.userName,
      domain: dto.domain,
      password: dto.password,
    });
  }
}
