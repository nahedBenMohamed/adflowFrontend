import type { FieldType } from '@/shared';
import type { SiteFormFieldTextMeta } from '../../models';

export type AddSiteFormFieldHandlerArgs = {
  fieldId: number;
  fieldLabel: string;
  fieldType: FieldType;
  entityTypeId: number;
  meta?: SiteFormFieldTextMeta;
};

export type AddSiteFormFieldHandler = ({
  fieldId,
  fieldLabel,
  fieldType,
  entityTypeId,
  meta,
}: AddSiteFormFieldHandlerArgs) => void;
