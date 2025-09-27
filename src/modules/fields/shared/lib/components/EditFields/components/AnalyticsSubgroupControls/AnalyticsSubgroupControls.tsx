import { PlusIconButton } from '@/shared';
import { observer } from 'mobx-react-lite';
import { Fragment, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { FieldsStore } from '../../../../../../store';
import { AnalyticsFieldSubgroupCode } from '../../../../models';

interface AnalyticsFieldSubgroupItem {
  code: AnalyticsFieldSubgroupCode;
  text: string;
  isVisible: boolean;
  onClick: () => void;
}

interface Props {
  fieldsStore: FieldsStore;
  onAddAnalyticsSubgroup: (code: AnalyticsFieldSubgroupCode) => void;
}

const AnalyticsSubgroupControls = observer((props: Props) => {
  const { fieldsStore, onAddAnalyticsSubgroup } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.components.edit_fields',
  });

  const getAddAnalyticsSubgroupHandler = useCallback(
    (code: AnalyticsFieldSubgroupCode) => () => onAddAnalyticsSubgroup(code),
    [onAddAnalyticsSubgroup]
  );

  const analyticsFieldsSubgroups = useMemo<AnalyticsFieldSubgroupItem[]>(
    () => [
      {
        code: AnalyticsFieldSubgroupCode.UTM,
        text: t('add_utm_fields'),
        isVisible: !fieldsStore.hasAnalyticsSubgroup(AnalyticsFieldSubgroupCode.UTM),
        onClick: getAddAnalyticsSubgroupHandler(AnalyticsFieldSubgroupCode.UTM),
      },
      {
        code: AnalyticsFieldSubgroupCode.GOOGLE,
        text: t('add_ga_fields'),
        isVisible: !fieldsStore.hasAnalyticsSubgroup(AnalyticsFieldSubgroupCode.GOOGLE),
        onClick: getAddAnalyticsSubgroupHandler(AnalyticsFieldSubgroupCode.GOOGLE),
      },
      {
        code: AnalyticsFieldSubgroupCode.YANDEX,
        text: t('add_ym_fields'),
        isVisible: !fieldsStore.hasAnalyticsSubgroup(AnalyticsFieldSubgroupCode.YANDEX),
        onClick: getAddAnalyticsSubgroupHandler(AnalyticsFieldSubgroupCode.YANDEX),
      },
      {
        code: AnalyticsFieldSubgroupCode.FACEBOOK,
        text: t('add_fb_fields'),
        isVisible: !fieldsStore.hasAnalyticsSubgroup(AnalyticsFieldSubgroupCode.FACEBOOK),
        onClick: getAddAnalyticsSubgroupHandler(AnalyticsFieldSubgroupCode.FACEBOOK),
      },
    ],
    [fieldsStore, getAddAnalyticsSubgroupHandler, t]
  );

  return analyticsFieldsSubgroups.map(g => (
    <Fragment key={g.code}>
      {g.isVisible && <PlusIconButton text={g.text} onClick={g.onClick} />}
    </Fragment>
  ));
});

AnalyticsSubgroupControls.displayName = 'AnalyticsSubgroupControls';
export { AnalyticsSubgroupControls };
