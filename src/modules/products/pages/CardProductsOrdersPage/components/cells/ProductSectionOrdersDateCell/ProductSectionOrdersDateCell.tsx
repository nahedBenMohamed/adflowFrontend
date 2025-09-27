import { memo } from 'react';
import styled from 'styled-components';
import { SpanWithEllipsis, TruncateMixin, type UtcDate } from '../../../../../../../shared';

const Root = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

interface Props {
  date: UtcDate;
}

const ProductSectionOrdersDateCell = memo((props: Props) => {
  const { date } = props;

  return (
    <Root>
      <SpanWithEllipsis text={date.displayShort()} />
    </Root>
  );
});

ProductSectionOrdersDateCell.displayName = 'ProductSectionOrdersDateCell';
export { ProductSectionOrdersDateCell };
