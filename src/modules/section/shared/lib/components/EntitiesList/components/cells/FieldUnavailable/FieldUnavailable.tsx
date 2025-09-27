import { Hint } from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-secondary-text);
`;

const FieldUnavailable = memo(() => {
  const { t } = useTranslation('component.section', {
    keyPrefix: 'section.section_table',
  });

  return (
    <Root>
      {t('hidden')}

      <Hint text={t('hidden_hint')} />
    </Root>
  );
});

FieldUnavailable.displayName = 'FieldUnavailable';
export { FieldUnavailable };
