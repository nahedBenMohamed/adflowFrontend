import { SpanWithEllipsis, truncateNumber, type Nullable } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useEffect, type ReactNode } from 'react';
import Collapsible from 'react-collapsible';
import styled, { css } from 'styled-components';
import { ArrowIcon, MailboxFolderInfo, type MailboxShortInfo } from '../../../../shared';
import { CollapsibleListItem } from '../CollapsibleListItem/CollapsibleListItem';

const TriggerLeftBlock = styled.div`
  max-width: 172px;

  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
  transition: var(--transition-200);
`;

const RightCaption = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: right;
  color: var(--button-text-graphite-primary-text);
  transition: var(--transition-200);
`;

const ArrowIconWrapper = styled.div<{ $active: boolean }>`
  width: 16px;
  height: 16px;

  transform: rotate(${p => (p.$active ? 0 : -90)}deg);
  transition: var(--transition-200);

  svg path {
    transition: var(--transition-200);
  }
`;

const TriggerWrapper = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;

  padding: 12px 16px;

  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    background: var(--graphite-graphite-20);
  }

  &:active {
    svg path {
      fill: var(--button-text-green-active);
    }

    ${TriggerLeftBlock} {
      color: var(--button-text-green-active);
    }

    ${ArrowIconWrapper} {
      svg path {
        fill: var(--button-text-green-active);
      }
    }

    ${RightCaption} {
      color: var(--button-text-green-active);
    }
  }

  ${p =>
    p.$active &&
    css`
      svg path {
        fill: var(--button-text-green-active);
      }

      ${TriggerLeftBlock} {
        color: var(--button-text-green-active);
      }

      ${ArrowIconWrapper} {
        svg path {
          fill: var(--button-text-green-active);
        }
      }

      ${RightCaption} {
        color: var(--button-text-green-active);
      }
    `}
`;

const TriggerRightBlock = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 4px;
`;

const IconWrapper = styled.div`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
`;

interface Props {
  Icon: ReactNode;
  active: boolean;
  leftCaption: string;
  rightCounter: number;
  sidebarOpened: boolean;
  activeNestedElement: Nullable<number>;
  items: MailboxFolderInfo[] | MailboxShortInfo[];
  loadMessages: (query: Nullable<number>) => void;
}

const CollapsibleList = observer((props: Props) => {
  const {
    Icon,
    active,
    rightCounter,
    leftCaption,
    sidebarOpened,
    activeNestedElement,
    items,
    loadMessages,
  } = props;

  const [opened, { close, toggle }] = useDisclosure(false);

  useEffect(() => {
    if (!sidebarOpened) close();
  }, [sidebarOpened, close]);

  const handleOpen = () => {
    if (!sidebarOpened) return;

    toggle();
  };

  return (
    <Collapsible
      trigger={
        <TriggerWrapper onClick={() => loadMessages(null)} $active={active}>
          <TriggerLeftBlock>
            {items.length > 0 && sidebarOpened && (
              <ArrowIconWrapper
                $active={opened}
                onClick={e => {
                  e.stopPropagation();
                  handleOpen();
                }}
              >
                <ArrowIcon />
              </ArrowIconWrapper>
            )}

            <IconWrapper>{Icon}</IconWrapper>

            {sidebarOpened && <SpanWithEllipsis text={leftCaption} />}
          </TriggerLeftBlock>

          {sidebarOpened && (
            <TriggerRightBlock>
              {rightCounter > 0 && (
                <RightCaption title={String(rightCounter)}>
                  {truncateNumber({ num: rightCounter, precision: 4 })}
                </RightCaption>
              )}
            </TriggerRightBlock>
          )}
        </TriggerWrapper>
      }
      triggerDisabled
      open={opened}
      transitionTime={100}
      handleTriggerClick={handleOpen}
    >
      <List>
        {items.map(i => {
          let folderType = undefined;

          if (i instanceof MailboxFolderInfo) folderType = i.type;

          return (
            <CollapsibleListItem
              key={i.id}
              name={i.name}
              total={i.total}
              unread={i.unread}
              folderType={folderType}
              active={activeNestedElement === i.id && active}
              onClick={() => loadMessages(i.id)}
            />
          );
        })}
      </List>
    </Collapsible>
  );
});

CollapsibleList.displayName = 'CollapsibleList';
export { CollapsibleList };
