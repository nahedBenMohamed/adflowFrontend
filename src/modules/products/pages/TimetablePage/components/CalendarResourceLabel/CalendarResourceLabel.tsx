import { SpanWithEllipsis, TruncateMixin } from '@/shared';
import { memo } from 'react';
import styled from 'styled-components';

const Root = styled.div`
  min-height: 40px;

  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

interface Props {
  label: string;
}

const CalendarResourceLabel = memo((props: Props) => {
  const { label } = props;

  return (
    <Root>
      <SpanWithEllipsis text={label} />
    </Root>
  );
});

CalendarResourceLabel.displayName = 'CalendarResourceLabel';
export { CalendarResourceLabel };
