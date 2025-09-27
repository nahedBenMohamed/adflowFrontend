import { iconStore } from '@/app';
import { SpanWithEllipsis } from '@/shared';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import type { ProductsSection } from '../../../../shared/';

const Root = styled.div`
  height: 60px;

  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;

  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--button-text-graphite-primary-text);
`;

const SectionIconWrapper = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    rect,
    circle,
    ellipse,
    path {
      fill: var(--button-text-graphite-primary-text);
    }
  }
`;

interface Props {
  productSection?: ProductsSection;
}

const CalendarResourceHeader = memo((props: Props) => {
  const { productSection } = props;

  const { t } = useTranslation('module.products', {
    keyPrefix: 'products.components.common.calendar',
  });

  return (
    <Root>
      {productSection ? (
        <>
          <SectionIconWrapper>{iconStore.getByName(productSection.icon).icon}</SectionIconWrapper>

          <SpanWithEllipsis text={productSection.name} />
        </>
      ) : (
        t('resources_label')
      )}
    </Root>
  );
});

CalendarResourceHeader.displayName = 'CalendarResourceHeader';
export { CalendarResourceHeader };
