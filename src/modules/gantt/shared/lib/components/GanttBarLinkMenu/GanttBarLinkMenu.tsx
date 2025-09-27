import { routes } from '@/app';
import { CardTab } from '@/modules/card';
import { TimelineTabIcon } from '@/modules/tasks';
import {
  BoardItemSecondary,
  BoardTabIcon,
  ListTabIcon,
  MyDropdown,
  OverviewTabIcon,
  UriCodingUtil,
} from '@/shared';
import { Portal } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useGanttContext } from '../../../../context';
import type { Bar } from '../../models';

interface RootProps {
  $x: number;
  $y: number;
}

const Root = styled(Portal)<RootProps>`
  position: absolute;

  top: ${p => p.$y}px;
  left: ${p => p.$x}px;

  z-index: var(--dropdown-z-index);
`;

const Content = styled.ul`
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 4px;

  padding: 10px 4px;
  z-index: var(--dropdown-z-index);
`;

export interface MenuPosition {
  x: number;
  y: number;
}

interface Props {
  bar: Bar;
  isOpen: boolean;
  position: MenuPosition;
  handleClose: () => void;
}

const GanttBarLinkMenu = (props: Props) => {
  const { bar, isOpen, position, handleClose } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.card_page_header',
  });

  const { entityTypeId } = useGanttContext();

  const { pathname, search } = useLocation();
  const currentPageEncodedUrl = UriCodingUtil.encode(`${pathname}${search}`);

  if (!entityTypeId) return null;

  const overviewLink = routes.card({
    entityTypeId,
    entityId: bar.record.id,
    from: currentPageEncodedUrl,
  });
  const boardLink = routes.card({
    entityTypeId,
    entityId: bar.record.id,
    tab: CardTab.BOARD,
    from: currentPageEncodedUrl,
  });
  const listLink = routes.card({
    entityTypeId,
    entityId: bar.record.id,
    tab: CardTab.LIST,
    from: currentPageEncodedUrl,
  });
  const timelineLink = routes.projectTasksTimeline({
    entityTypeId,
    entityId: bar.record.id,
    from: currentPageEncodedUrl,
    view: 'hour',
  });

  return (
    <Root $x={position.x} $y={position.y}>
      <MyDropdown show={() => {}} opened={isOpen} hide={handleClose}>
        <Content>
          <BoardItemSecondary name={t('overview')} Icon={<OverviewTabIcon />} link={overviewLink} />
          <BoardItemSecondary name={t('board')} Icon={<BoardTabIcon />} link={boardLink} />
          <BoardItemSecondary name={t('list')} Icon={<ListTabIcon />} link={listLink} />
          <BoardItemSecondary name={t('timeline')} Icon={<TimelineTabIcon />} link={timelineLink} />
        </Content>
      </MyDropdown>
    </Root>
  );
};

export { GanttBarLinkMenu };
