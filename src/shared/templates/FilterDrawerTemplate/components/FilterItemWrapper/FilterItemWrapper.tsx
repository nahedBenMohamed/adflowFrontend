import type { ReactNode } from 'react';
import styled from 'styled-components';
import { ClearRoundButton, SpanWithEllipsis, TruncateMixin } from '../../../../lib';

const Root = styled.div<{ $alignItemsCenter: boolean }>`
  min-height: 32px;

  display: grid;
  grid-template-columns: 40% 50% 20px;
  align-items: ${p => (p.$alignItemsCenter ? 'center' : 'flex-start')};
  gap: 8px;
`;

const TitleWrapper = styled.div<{ $paddingTop?: string }>`
  padding-top: ${p => p.$paddingTop};

  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  ${TruncateMixin}
`;

interface ClearProps {
  clearVisible: boolean;
  onClear: () => void;
}

interface Props {
  label: string;
  children: ReactNode;
  clearProps?: ClearProps;
  labelPaddingTop?: string;
  alignItemsCenter?: boolean;
}

const FilterItemWrapper = (props: Props) => {
  const { label, children, clearProps, labelPaddingTop, alignItemsCenter = true } = props;

  return (
    <Root $alignItemsCenter={alignItemsCenter}>
      <TitleWrapper $paddingTop={labelPaddingTop}>
        <SpanWithEllipsis text={label} />
      </TitleWrapper>

      {children}

      {clearProps && clearProps.clearVisible && (
        <ClearRoundButton
          marginTop={alignItemsCenter ? undefined : labelPaddingTop}
          onClick={clearProps.onClear}
        />
      )}
    </Root>
  );
};

export { FilterItemWrapper };
