import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { FIELDS_QUERY_KEYS } from '../../FieldsQueryKeys';
import { fieldsSettingsApi } from '../FieldSettingsApi';

export const useGetFieldSettings = (entityTypeId: number) =>
  useQuery({
    refetchOnWindowFocus: false,
    queryKey: FIELDS_QUERY_KEYS.fieldSettings(entityTypeId),
    placeholderData: keepPreviousData,
    queryFn: () => fieldsSettingsApi.getFieldSettings(entityTypeId),
  });
