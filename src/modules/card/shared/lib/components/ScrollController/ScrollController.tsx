import { ScrollbarArrowIcon } from '@/shared';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { ScrollButton } from './ScrollButton';

const Root = styled.div`
  position: sticky;
  top: 2px;
  right: 2px;

  width: 60px;
  height: 31px;

  display: flex;
  gap: 1px;

  background: var(--graphite-graphite-80);
  border-radius: var(--border-radius-block);
  box-shadow:
    0px 1px 1px #d0daeb,
    0px 0px 2px #eef4fe;
`;

interface Props {
  leftButtonDisabled: boolean;
  rightButtonDisabled: boolean;
  scrollLeft: () => void;
  scrollRight: () => void;
}

const ScrollController = observer((props: Props) => {
  const { leftButtonDisabled, rightButtonDisabled, scrollLeft, scrollRight } = props;

  return (
    <Root>
      <ScrollButton disabled={leftButtonDisabled} $reverse onClick={scrollLeft}>
        <ScrollbarArrowIcon />
      </ScrollButton>

      <ScrollButton disabled={rightButtonDisabled} onClick={scrollRight}>
        <ScrollbarArrowIcon />
      </ScrollButton>
    </Root>
  );
});

ScrollController.displayName = 'ScrollController';
export { ScrollController };
