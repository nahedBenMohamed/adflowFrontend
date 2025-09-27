import { SettingsStore } from '@/app';
import { authStore } from '@/modules/auth';
import {
  HeaderRoundButton,
  MyIndicator,
  UtcDate,
  type Optional,
  type TutorialProductType,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetTutorialCount } from '../../../../api';
import { TutorialButtonIcon } from '../../../assets';
import {
  TUTORIAL_SETTINGS_KEY,
  type TutorialLastOpenedProduct,
  type TutorialSettings,
} from '../../models';
import { TutorialDrawer } from '../TutorialDrawer/TutorialDrawer';

interface Props {
  productType: TutorialProductType;
  objectId?: number;
}

const { settings } = SettingsStore.getSettingsStore<TutorialSettings>(TUTORIAL_SETTINGS_KEY);

if (!settings.lastOpenedProducts) settings.lastOpenedProducts = [];

const TutorialButton = observer((props: Props) => {
  const { productType, objectId } = props;

  const { t } = useTranslation('module.tutorial', {
    keyPrefix: 'tutorial.tutorial_drawer',
  });

  const buttonRef = useRef<HTMLButtonElement>(null);

  const currentSettings: Optional<TutorialLastOpenedProduct> = settings.lastOpenedProducts.find(
    s => s.productType === productType && s.objectId === objectId
  );

  const { user: currentUser } = authStore;

  const [opened, { close, toggle }] = useDisclosure(false);

  const lastOpenedDate = currentSettings?.lastOpenedDate;

  const { data: tutorialCount, refetch: refetchTutorialCount } = useGetTutorialCount({
    objectId,
    productType,
    userId: currentUser?.id,
    from: lastOpenedDate,
  });

  const handleUpdateLastOpenedDateInSettings = useCallback(
    (lastOpenedDate: string) => {
      if (currentSettings) {
        settings.lastOpenedProducts = settings.lastOpenedProducts.map(s =>
          s.productType === productType && s.objectId === objectId ? { ...s, lastOpenedDate } : s
        );
      } else {
        settings.lastOpenedProducts = [
          ...settings.lastOpenedProducts,
          {
            objectId,
            productType,
            lastOpenedDate,
          },
        ];
      }
    },
    [objectId, productType, currentSettings]
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const handleToggleDrawer = useCallback(() => {
    if (!opened) {
      timeoutRef.current = setTimeout(() => {
        handleUpdateLastOpenedDateInSettings(UtcDate.nowISO());
      }, 3000);

      refetchTutorialCount();
    }

    if (opened && timeoutRef.current) {
      clearTimeout(timeoutRef.current);

      handleUpdateLastOpenedDateInSettings(UtcDate.nowISO());
    }

    toggle();
  }, [opened, toggle, handleUpdateLastOpenedDateInSettings, refetchTutorialCount]);

  return (
    <>
      <MyIndicator processing size={12} offset={4} withBorder disabled={!tutorialCount}>
        <HeaderRoundButton
          ref={buttonRef}
          active={opened}
          label={t('title')}
          onClick={handleToggleDrawer}
        >
          <TutorialButtonIcon />
        </HeaderRoundButton>
      </MyIndicator>

      {currentUser && (
        <TutorialDrawer
          opened={opened}
          objectId={objectId}
          buttonRef={buttonRef}
          currentUser={currentUser}
          productType={productType}
          lastOpenedDate={lastOpenedDate}
          hide={close}
          handleUpdateLastOpenedDateInSettings={handleUpdateLastOpenedDateInSettings}
        />
      )}
    </>
  );
});

TutorialButton.displayName = 'TutorialButton';
export { TutorialButton };
