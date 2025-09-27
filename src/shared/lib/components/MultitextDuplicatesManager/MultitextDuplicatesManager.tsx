import { useDisclosure } from '@mantine/hooks';
import { Ref, RefObject, useCallback } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import type { InputModel } from '../../models';
import { DuplicatesForbiddenModal, DuplicatesWarningModal } from './components';

interface Props {
  searchModel: InputModel;
  inputRef: Ref<HTMLInputElement>;
  duplicatesAllowed: boolean;
  hasExactDuplicates: boolean;
  duplicatesWarningShown: boolean;
  hidePopover: () => void;
  showPopover: () => void;
  hideDuplicatesWarning: () => void;
  clearDuplicatesInfo: () => void;
}

const MultitextDuplicatesManager = (props: Props) => {
  const {
    searchModel,
    inputRef,
    duplicatesAllowed,
    hasExactDuplicates,
    duplicatesWarningShown,
    hidePopover,
    showPopover,
    hideDuplicatesWarning,
    clearDuplicatesInfo,
  } = props;

  const [
    duplicatesForbiddenShown,
    { open: showDuplicatesForbidden, close: hideDuplicatesForbidden },
  ] = useDisclosure(false);

  // try to select existing card
  const handleApproveDuplicateWarning = useCallback(() => {
    if (typeof inputRef === 'function') return;

    inputRef?.current?.focus();

    hideDuplicatesWarning();
    showPopover();
  }, [inputRef, showPopover, hideDuplicatesWarning]);

  // create duplicate
  const handleCancelDuplicateWarning = useCallback(() => {
    hideDuplicatesWarning();
    hidePopover();

    clearDuplicatesInfo();
  }, [hideDuplicatesWarning, clearDuplicatesInfo, hidePopover]);

  // try to select existing card
  const handleApproveDuplicatesForbidden = useCallback(() => {
    if (typeof inputRef === 'function') return;

    inputRef?.current?.focus();

    showPopover();
    hideDuplicatesForbidden();
  }, [inputRef, hideDuplicatesForbidden, showPopover]);

  // cancel, clearing input value
  const handleCancelDuplicatesForbidden = useCallback(() => {
    if (typeof inputRef === 'function') return;

    searchModel.value = '';
    inputRef?.current?.focus();

    hideDuplicatesForbidden();

    clearDuplicatesInfo();
  }, [searchModel, inputRef, hideDuplicatesForbidden, clearDuplicatesInfo]);

  useOnClickOutside(inputRef as RefObject<HTMLDivElement>, e => {
    if (duplicatesAllowed) return;

    if (hasExactDuplicates) {
      const target = e.target as HTMLElement;

      if (
        target.closest('.workspace__OverlayingModal--Overlay') ||
        target.closest('.workspace__OverlayingModal--Content') ||
        target.closest('.workspace__MyDropdown--StyledDropdown') ||
        target.closest('.workspace__MyPopover--StyledDropdown')
      )
        return;

      if (target.closest('.workspace__ActionMenu--Cancel')) {
        clearDuplicatesInfo();

        return;
      }

      showDuplicatesForbidden();
    }
  });

  return (
    <>
      {/* Duplicates are allowed in account settings */}
      {duplicatesWarningShown && duplicatesAllowed && (
        <DuplicatesWarningModal
          opened={duplicatesWarningShown}
          onCancel={handleCancelDuplicateWarning}
          onApprove={handleApproveDuplicateWarning}
        />
      )}

      {/* Duplicates are forbidden in account settings */}
      {duplicatesForbiddenShown && !duplicatesAllowed && (
        <DuplicatesForbiddenModal
          opened={duplicatesForbiddenShown}
          onCancel={handleCancelDuplicatesForbidden}
          onApprove={handleApproveDuplicatesForbidden}
        />
      )}
    </>
  );
};

export { MultitextDuplicatesManager };
