import type { MySelectTitleRootVariant } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type ReactNode } from 'react';
import styled from 'styled-components';
import { MySelectTitle } from '../../../Form/MySelect/components';
import { MyDropdown } from '../../../MyDropdown/MyDropdown';
import { Controls } from '../Controls/Controls';

const Root = styled.div`
  max-width: 240px;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DropdownContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  overflow: hidden;
`;

interface MenuShowHideProps {
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
}

interface ShowHideHandlers {
  opened: boolean;
  show: () => void;
  hide: () => void;
}

interface Props {
  children: ReactNode;
  activeBoard: string;
  isAdding?: boolean;
  disabled?: boolean;
  variant?: MySelectTitleRootVariant;
  hideAddBoardControl?: boolean;
  overrideShowHideHandlers?: ShowHideHandlers;
  CustomButton?: ReactNode;
  handleAddNewBoard?: (boardName: string) => Promise<void>;
}

const SELECT_WIDTH = 240;

const BoardPicker = observer((props: Props) => {
  const {
    children,
    activeBoard,
    isAdding,
    variant = 'outlined-without-active-shadow',
    disabled,
    hideAddBoardControl,
    overrideShowHideHandlers,
    CustomButton,
    handleAddNewBoard,
  } = props;

  const [isDropdownOpen, { open: showDropdown, close: hideDropdown }] = useDisclosure(false);
  const [isAddMode, { open: showAddMode, close: hideAddMode }] = useDisclosure(false);

  const menuShowHideProps = useMemo<MenuShowHideProps>(
    () =>
      overrideShowHideHandlers
        ? {
            opened: overrideShowHideHandlers.opened,
            onOpen: overrideShowHideHandlers.show,
            onClose: overrideShowHideHandlers.hide,
          }
        : {
            opened: isDropdownOpen,
            onOpen: showDropdown,
            onClose: hideDropdown,
          },
    [isDropdownOpen, overrideShowHideHandlers, hideDropdown, showDropdown]
  );

  const handleAddNew = useCallback(
    async (boardName: string): Promise<void> => await handleAddNewBoard?.(boardName),
    [handleAddNewBoard]
  );

  const handleShowDropdown = useCallback(() => {
    menuShowHideProps.onOpen();
  }, [menuShowHideProps]);

  const handleHideDropdown = useCallback(() => {
    menuShowHideProps.onClose();
    hideAddMode();
  }, [hideAddMode, menuShowHideProps]);

  return (
    <Root>
      <MyDropdown
        withinPortal
        width={SELECT_WIDTH}
        opened={menuShowHideProps.opened}
        position="bottom-start"
        Button={
          CustomButton ? (
            CustomButton
          ) : (
            <MySelectTitle
              gap="6px"
              disabled={disabled}
              maxWidth={SELECT_WIDTH}
              active={menuShowHideProps.opened}
              variant={variant}
            >
              {activeBoard}
            </MySelectTitle>
          )
        }
        hide={handleHideDropdown}
        show={handleShowDropdown}
      >
        <DropdownContentWrapper>
          {children}

          {!hideAddBoardControl && handleAddNewBoard && isAdding !== undefined && (
            <Controls
              isAdding={isAdding}
              isAddMode={isAddMode}
              showAddMode={showAddMode}
              handleAddNew={handleAddNew}
              handleCancel={hideAddMode}
            />
          )}
        </DropdownContentWrapper>
      </MyDropdown>
    </Root>
  );
});

BoardPicker.displayName = 'BoardPicker';
export { BoardPicker };
