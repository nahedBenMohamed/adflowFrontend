import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

type RootWidth = 'small' | 'medium' | 'large' | 'x-large' | 'xx-large' | 'xxx-large';

const Root = styled.div<{ $width: RootWidth }>`
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  font-size: 12px;
  font-weight: 500;
  line-height: 17px;
  text-align: center;
  color: var(--button-text-graphite-priory-text);

  padding: 4px;
  border-radius: var(--border-radius-element);
  border: 1px solid var(--button-text-graphite-primary-text);

  ${p => {
    switch (p.$width) {
      case 'small':
        return `width: 18px;`;

      case 'medium':
        return `width: 24px;`;

      case 'large':
        return `width: 32px;`;

      case 'x-large':
        return `width: 40px;`;

      case 'xx-large':
        return `width: 48px;`;

      case 'xxx-large':
        return `width: fit-content;`;
    }
  }}
`;

interface Props {
  count: number;
}

const ColumnCount = observer((props: Props) => {
  const { count } = props;

  const getWidthType = (count: number): RootWidth => {
    if (count < 10) {
      return 'small';
    } else if (count < 100) {
      return 'medium';
    } else if (count < 1000) {
      return 'large';
    } else if (count < 10000) {
      return 'x-large';
    } else if (count < 100000) {
      return 'xx-large';
    } else {
      return 'xxx-large';
    }
  };

  return <Root $width={getWidthType(count)}>{count}</Root>;
});

ColumnCount.displayName = 'ColumnCount';
export { ColumnCount };
