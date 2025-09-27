import { baseApi } from '@/app';
import { UrlTemplateUtil } from '@/shared';
import { SiteForm } from '../../shared';
import { BuilderApiRoutes } from '../BuilderApiRoutes';
import type { CreateSiteFormDto, UpdateSiteFormDto } from '../dtos';

class SiteFormApi {
  getSiteForms = async (): Promise<SiteForm[]> => {
    const response = await baseApi.get(BuilderApiRoutes.GET_SITE_FORMS);

    return SiteForm.fromDtos(response.data);
  };

  getFullSiteForms = async (): Promise<SiteForm[]> => {
    const response = await baseApi.get(BuilderApiRoutes.GET_SITE_FORMS, {
      params: {
        expand: 'consent,gratitude,pages,pages.fields,entityTypeLinks,scheduleLinks',
      },
    });

    return SiteForm.fromDtos(response.data);
  };

  getFullSiteForm = async (formId: number): Promise<SiteForm> => {
    const response = await baseApi.get(
      UrlTemplateUtil.toPath(BuilderApiRoutes.GET_SITE_FORM, {
        formId,
      }),
      {
        params: {
          expand: 'consent,gratitude,pages,pages.fields,entityTypeLinks,scheduleLinks',
        },
      }
    );

    return SiteForm.fromDto(response.data);
  };

  createSiteForm = async (dto: CreateSiteFormDto): Promise<SiteForm> => {
    const response = await baseApi.post(BuilderApiRoutes.CREATE_SITE_FORM, dto);

    return SiteForm.fromDto(response.data);
  };

  updateSiteForm = async ({
    formId,
    dto,
  }: {
    formId: number;
    dto: UpdateSiteFormDto;
  }): Promise<SiteForm> => {
    const response = await baseApi.patch(
      UrlTemplateUtil.toPath(BuilderApiRoutes.UPDATE_SITE_FORM, {
        formId,
      }),
      dto
    );

    return SiteForm.fromDto(response.data);
  };

  deleteSiteForm = async (formId: number): Promise<void> => {
    await baseApi.delete(
      UrlTemplateUtil.toPath(BuilderApiRoutes.DELETE_SITE_FORM, {
        formId,
      })
    );
  };
}

export const siteFormApi = new SiteFormApi();
