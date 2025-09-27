import styled from 'styled-components';
import { TruncateMixin } from '../../mixins';
import { ColorUtil } from '../../utils';
import { SpanWithEllipsis } from '../SpanWithEllipsis/SpanWithEllipsis';

interface RootProps {
  $color: string;
  $bgColor: string;
}

export const Root = styled.div<RootProps>`
  height: 28px;
  max-width: fit-content;

  display: flex;
  align-items: center;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${p => p.$color};

  padding: 2px 8px 3px;
  background-color: ${p => p.$bgColor};
  border-radius: var(--border-radius-element);

  ${TruncateMixin}
`;

interface Props {
  text: string;
  bgColor: string;
}

const ColoredBlock = (props: Props) => {
  const { text, bgColor } = props;

  const checkedBgColor = ColorUtil.getProcessedBGColor(bgColor);
  const color = ColorUtil.getTextContrastColorByBgColorHex(checkedBgColor);

  return (
    <Root $color={color} $bgColor={bgColor}>
      <SpanWithEllipsis text={text} />
    </Root>
  );
};

export { ColoredBlock };
