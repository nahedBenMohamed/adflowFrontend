import { PrimaryButton } from '@/shared';
import { useTranslation } from 'react-i18next';
import { TickIcon } from '../../../../../../assets';

interface Props {
  completed: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const CompleteButton = (props: Props) => {
  const { completed, disabled = false, onClick } = props;

  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.task_item',
  });

  return (
    <PrimaryButton
      variant={completed ? 'outlined' : 'filled'}
      disabled={disabled}
      iconProps={
        completed
          ? {
              Icon: <TickIcon />,
              path: {
                pathFill: 'var(--button-text-graphite-secondary-text)',
                pathFillHover: 'var(--button-text-graphite-primary-text)',
              },
            }
          : undefined
      }
      onClick={onClick}
    >
      {completed ? t('completed') : t('complete')}
    </PrimaryButton>
  );
};

export { CompleteButton };
