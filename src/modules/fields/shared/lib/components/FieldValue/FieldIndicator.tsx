import { MyTooltip, type Nullable } from '@/shared';
import { memo, useMemo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FieldFilledIcon, ImportantFieldIcon, MandatoryFieldIcon } from '../../../assets';

const Root = styled.div<{ $withSelect?: boolean }>`
  width: 16px;
  height: ${p => (p.$withSelect ? '28px' : 'var(--field-component-height)')};

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export type IndicatorType = 'important' | 'mandatory' | 'filled-important' | 'filled-mandatory';

interface Props {
  withSelect?: boolean;
  type: Nullable<IndicatorType>;
}

const FieldIndicator = memo((props: Props) => {
  const { withSelect, type } = props;

  const { t } = useTranslation('module.fields', {
    keyPrefix: 'fields.field_value',
  });

  const iconMap: Record<IndicatorType, { component: ReactNode; label: string }> = useMemo(
    () => ({
      important: { component: <ImportantFieldIcon />, label: t('important_field') },
      mandatory: { component: <MandatoryFieldIcon />, label: t('mandatory_field') },
      'filled-important': { component: <FieldFilledIcon />, label: t('important_field_completed') },
      'filled-mandatory': { component: <FieldFilledIcon />, label: t('mandatory_field_completed') },
    }),
    [t]
  );

  if (!type) return <Root />;

  const { component, label } = iconMap[type];

  return (
    <Root $withSelect={withSelect}>
      <MyTooltip withinPortal label={label}>
        <IconWrapper>{component}</IconWrapper>
      </MyTooltip>
    </Root>
  );
});

FieldIndicator.displayName = 'FieldIndicator';
export { FieldIndicator };
