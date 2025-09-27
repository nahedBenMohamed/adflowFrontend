import { PrimaryButton, type PrimaryButtonProps } from '@/shared';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ReadAllIcon } from '../../../../../assets';

interface Props {
  disabled: boolean;
  handleReadAll?: () => void;
}

const ReadAllButton = (props: Props) => {
  const { disabled, handleReadAll } = props;

  const { t } = useTranslation('module.notifications', {
    keyPrefix: 'notifications.components.notifications_panel.ui.read_all_button',
  });

  const iconProps = useMemo<PrimaryButtonProps['iconProps']>(
    () => ({
      Icon: <ReadAllIcon />,
      path: {
        pathFill: disabled
          ? 'var(--button-text-graphite-secondary-text)'
          : 'var(--primary-statuses-white-0)',
      },
    }),
    [disabled]
  );

  return (
    <PrimaryButton
      disabled={disabled}
      iconProps={iconProps}
      variant={disabled ? 'outlined' : 'filled'}
      onClick={handleReadAll}
    >
      {t('read_all')}
    </PrimaryButton>
  );
};

export { ReadAllButton };
