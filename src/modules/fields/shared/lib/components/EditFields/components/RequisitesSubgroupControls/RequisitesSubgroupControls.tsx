import { PlusIconButton } from '@/shared';
import { observer } from 'mobx-react-lite';
import { Fragment, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { FieldsStore } from '../../../../../../store';
import { RequisitesFieldSubgroupCode } from '../../../../models';

interface DetailsFieldSubgroupItem {
  text: string;
  isVisible: boolean;
  code: RequisitesFieldSubgroupCode;
  onClick: () => void;
}

interface Props {
  fieldsStore: FieldsStore;
  onAddRequisitesSubgroup: (code: RequisitesFieldSubgroupCode) => void;
}

const RequisitesSubgroupControls = observer((props: Props) => {
  const { fieldsStore, onAddRequisitesSubgroup } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.components.edit_fields',
  });

  const getAddRequisitesSubgroupHandler = useCallback(
    (code: RequisitesFieldSubgroupCode) => () => onAddRequisitesSubgroup(code),
    [onAddRequisitesSubgroup]
  );

  const analyticsFieldsSubgroups = useMemo<DetailsFieldSubgroupItem[]>(
    () => [
      {
        code: RequisitesFieldSubgroupCode.BANK_REQUISITES,
        text: t('add_bank_requisites'),
        isVisible: !fieldsStore.hasRequisitesSubgroup(RequisitesFieldSubgroupCode.BANK_REQUISITES),
        onClick: getAddRequisitesSubgroupHandler(RequisitesFieldSubgroupCode.BANK_REQUISITES),
      },
      {
        code: RequisitesFieldSubgroupCode.SP_AND_ORGANIZATION_REQUISITES,
        text: t('add_org_requisites'),
        isVisible: !fieldsStore.hasRequisitesSubgroup(
          RequisitesFieldSubgroupCode.SP_AND_ORGANIZATION_REQUISITES
        ),
        onClick: getAddRequisitesSubgroupHandler(
          RequisitesFieldSubgroupCode.SP_AND_ORGANIZATION_REQUISITES
        ),
      },
      {
        code: RequisitesFieldSubgroupCode.SP_AND_ORGANIZATION_STATISTICAL_CODES,
        text: t('add_org_stat_codes'),
        isVisible: !fieldsStore.hasRequisitesSubgroup(
          RequisitesFieldSubgroupCode.SP_AND_ORGANIZATION_STATISTICAL_CODES
        ),
        onClick: getAddRequisitesSubgroupHandler(
          RequisitesFieldSubgroupCode.SP_AND_ORGANIZATION_STATISTICAL_CODES
        ),
      },
      {
        code: RequisitesFieldSubgroupCode.ADDITIONAL_SP_AND_ORGANIZATION_REQUISITES,
        text: t('add_additional_org_requisites'),
        isVisible: !fieldsStore.hasRequisitesSubgroup(
          RequisitesFieldSubgroupCode.ADDITIONAL_SP_AND_ORGANIZATION_REQUISITES
        ),
        onClick: getAddRequisitesSubgroupHandler(
          RequisitesFieldSubgroupCode.ADDITIONAL_SP_AND_ORGANIZATION_REQUISITES
        ),
      },
    ],
    [fieldsStore, getAddRequisitesSubgroupHandler, t]
  );

  return analyticsFieldsSubgroups.map(g => (
    <Fragment key={g.code}>
      {g.isVisible && <PlusIconButton text={g.text} onClick={g.onClick} />}
    </Fragment>
  ));
});

RequisitesSubgroupControls.displayName = 'RequisitesSubgroupControls';
export { RequisitesSubgroupControls };
