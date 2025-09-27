import { baseApi } from '@/app';
import { type JwtToken, type Nullable, UrlTemplateUtil, User } from '@/shared';
import { PartnerLead, PartnerSummary } from '../../shared';
import { PartnerApiRoutes } from '../PartnerApiRoutes';

class PartnerApi {
  login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<Nullable<JwtToken>> => {
    const response = await baseApi.post(PartnerApiRoutes.PARTNER_LOGIN, { email, password });

    return response.data;
  };

  getPartnerUser = async (partnerId: number): Promise<User> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(PartnerApiRoutes.GET_PARTNER_USER, { partnerId })
    );

    return User.fromDto(response.data);
  };

  getPartnerSummary = async (partnerId: number): Promise<PartnerSummary> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(PartnerApiRoutes.GET_PARTNER_SUMMARY, { partnerId })
    );

    return PartnerSummary.fromDto(response.data);
  };

  getPartnerLeads = async (partnerId: number): Promise<PartnerLead[]> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(PartnerApiRoutes.GET_PARTNER_LEADS, { partnerId })
    );

    return PartnerLead.fromDtos(response.data);
  };
}

export const partnerApi = new PartnerApi();
