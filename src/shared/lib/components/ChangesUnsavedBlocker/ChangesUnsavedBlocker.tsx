import { useDidUpdate, useDisclosure } from '@mantine/hooks';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlocker, type BlockerFunction } from 'react-router-dom';
import { WarningModal } from '../Modals/WarningModal/WarningModal';

interface Props {
  shouldBlock: boolean | BlockerFunction;
  handleSaveChanges: () => void;
  showCustomWarningOnBlocked?: () => void;
}

const ChangesUnsavedBlocker = memo((props: Props) => {
  const { shouldBlock, handleSaveChanges, showCustomWarningOnBlocked } = props;

  const { t } = useTranslation('common', {
    keyPrefix: 'changes_unsaved_blocker',
  });

  // https://reactrouter.com/en/6.21.1/hooks/use-blocker
  const blocker = useBlocker(shouldBlock);

  const [warningShown, { open: showWarning, close: hideWarning }] = useDisclosure(false);

  useDidUpdate(() => {
    if (blocker.state === 'blocked') {
      if (showCustomWarningOnBlocked) {
        blocker.reset?.();

        showCustomWarningOnBlocked();

        return;
      }

      showWarning();
    } else {
      hideWarning();
    }
  }, [blocker.state]);

  // leave and save changes
  const handleProceed = useCallback(async (): Promise<void> => {
    handleSaveChanges();

    blocker.proceed?.();
  }, [blocker, handleSaveChanges]);

  // leave without saving changes
  const handleReset = useCallback(() => blocker.proceed?.(), [blocker]);

  const handleClose = useCallback(() => blocker.reset?.(), [blocker]);

  return (
    <WarningModal
      width="464px"
      icon="warning"
      isDanger={false}
      maxHeight="336px"
      title={t('title')}
      cancelOnClose={false}
      annotation={t('annotation')}
      cancelTitle={t('cancel_title')}
      approveTitle={t('approve_title')}
      isOpened={warningShown}
      onClose={handleClose}
      onCancel={handleReset}
      onApprove={handleProceed}
    />
  );
});

ChangesUnsavedBlocker.displayName = 'ChangesUnsavedBlocker';
export { ChangesUnsavedBlocker };
