import {
  CustomizeButton,
  DefaultLoader,
  MyDrawer,
  MyDrawerHeaderTitle,
  UtcDate,
  throttle,
  type TutorialProductType,
  type User,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useEffect, useMemo, useRef, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  useGetExpandedTutorialGroups,
  type GetExpandedTutorialGroupsQueryParams,
} from '../../../../api';
import { TutorialEditModeStore } from '../../../../store';
import { TutorialDrawerContent, TutorialDrawerEditMode, TutorialDrawerEmpty } from './components';

const Header = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const LoaderWrapper = styled.div`
  padding-top: 80px;
`;

interface Props {
  opened: boolean;
  currentUser: User;
  productType: TutorialProductType;
  buttonRef: RefObject<HTMLButtonElement | null>;
  objectId?: number;
  lastOpenedDate?: string;
  hide: () => void;
  handleUpdateLastOpenedDateInSettings: (lastOpenedDate: string) => void;
}

const TutorialDrawer = (props: Props) => {
  const {
    opened,
    currentUser: { id: userId, isAdmin },
    productType,
    buttonRef,
    objectId,
    lastOpenedDate,
    hide,
    handleUpdateLastOpenedDateInSettings,
  } = props;

  const { t } = useTranslation('module.tutorial', {
    keyPrefix: 'tutorial.tutorial_drawer',
  });

  const queryParams = useMemo<GetExpandedTutorialGroupsQueryParams>(
    () => ({
      userId,
      objectId,
      productType,
    }),
    [objectId, productType, userId]
  );

  const tutorialEditModeStore = useMemo(
    () => new TutorialEditModeStore(queryParams),
    [queryParams]
  );

  const {
    isLoading,
    data: tutorialGroups,
    refetch: refetchExpandedTutorialGroups,
  } = useGetExpandedTutorialGroups({
    enabled: opened,
    queryParams: {
      userId,
      objectId,
      productType,
    },
  });

  const [editMode, { toggle: toggleEditMode, close: closeEditMode }] = useDisclosure(false);

  useEffect(() => {
    // load data only once, then it will be invalidated in handleToggleEditMode
    if (editMode && !tutorialEditModeStore.isLoaded) tutorialEditModeStore.loadData();
  }, [editMode, tutorialEditModeStore]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledRefetchExpandedTutorialGroups = useCallback(
    throttle(refetchExpandedTutorialGroups, 500),
    [refetchExpandedTutorialGroups]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledInvalidateTutorialGroupsInCache = useCallback(
    throttle(tutorialEditModeStore.invalidateTutorialGroupsInCache, 500),
    [tutorialEditModeStore]
  );

  const handleToggleEditMode = useCallback(() => {
    if (editMode) {
      throttledRefetchExpandedTutorialGroups();

      // so new groups indication on TutorialButton won't be shown to a user who just possibly added new groups,
      // for same reason we do this in handleHideDrawer below
      handleUpdateLastOpenedDateInSettings(UtcDate.nowISO());
    } else {
      throttledInvalidateTutorialGroupsInCache();
    }

    toggleEditMode();
  }, [
    editMode,
    toggleEditMode,
    throttledRefetchExpandedTutorialGroups,
    throttledInvalidateTutorialGroupsInCache,
    handleUpdateLastOpenedDateInSettings,
  ]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleHideDrawer = useCallback(() => {
    hide();
    handleUpdateLastOpenedDateInSettings(UtcDate.nowISO());

    if (editMode)
      timeoutRef.current = setTimeout(() => {
        closeEditMode();
      }, 250);
  }, [editMode, hide, closeEditMode, handleUpdateLastOpenedDateInSettings]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <MyDrawer
      opened={opened}
      buttonRef={buttonRef}
      width={editMode ? '769px' : '480px'}
      Header={
        <Header>
          <MyDrawerHeaderTitle>{t('title')}</MyDrawerHeaderTitle>

          {isAdmin() && (
            <CustomizeButton
              active={editMode}
              backgroundColor="var(--primary-statuses-white-0)"
              onClick={handleToggleEditMode}
            />
          )}
        </Header>
      }
      hide={handleHideDrawer}
    >
      {editMode ? (
        <TutorialDrawerEditMode tutorialEditModeStore={tutorialEditModeStore} />
      ) : isLoading ? (
        <LoaderWrapper>
          <DefaultLoader />
        </LoaderWrapper>
      ) : tutorialGroups &&
        tutorialGroups.length > 0 &&
        // we still consider panel empty if we received only empty groups
        tutorialGroups.some(g => g.items.length > 0) ? (
        <TutorialDrawerContent tutorialGroups={tutorialGroups} lastOpenedDate={lastOpenedDate} />
      ) : (
        <TutorialDrawerEmpty />
      )}
    </MyDrawer>
  );
};

TutorialDrawer.displayName = 'TutorialDrawer';
export { TutorialDrawer };
