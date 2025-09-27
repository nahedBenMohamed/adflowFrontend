import { FunctionalTextEditor, useHasMore } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import DOMPurify from 'dompurify';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, type MouseEvent } from 'react';
import styled, { css } from 'styled-components';
import type { EditTextProps } from '../../../../../../models';
import { FeedItemShowMoreButton } from '../FeedItemShowMoreButton/FeedItemShowMoreButton';
import { InnerHTMLNormalizer } from '../InnerHTMLNormalizer/InnerHTMLNormalizer';
import { TextEditorControls } from '../TextEditorControls/TextEditorControls';

interface TextWrapperProps {
  $bgColor?: string;
  $clickable?: boolean;
  $noPadding?: boolean;
  $isEditMode?: boolean;
}

const TextWrapper = styled.div<TextWrapperProps>`
  width: 100%;

  display: flex;
  flex-direction: column;

  padding: ${p => !p.$noPadding && 16}px;
  border-radius: var(--border-radius-block);
  background-color: ${p =>
    p.$isEditMode ? `var(--primary-statuses-white-0)` : p.$bgColor ? p.$bgColor : `transparent`};
  transition: var(--transition-200);

  ${p =>
    p.$clickable &&
    !p.$isEditMode &&
    css`
      border: 1px solid transparent;

      &:hover {
        cursor: pointer;

        border-color: var(--button-text-graphite-secondary-text);
      }
    `}

  ${p =>
    p.$isEditMode &&
    css`
      border-radius: var(--border-radius-element);
      border: 1px solid var(--button-text-green-active);
      box-shadow: 1px 1px 6px 0px var(--primary-statuses-green-520);
    `}
`;

const ShowMoreButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-top: 8px;
`;

interface Props {
  text: string;
  editTextProps: EditTextProps;
  noPadding?: boolean;
  bgColor?: string;
  autoFocus?: boolean;
  isRedShowMoreButton?: boolean;
  handleClick?: () => void;
}

const ResultBlock = observer((props: Props) => {
  const { text, editTextProps, bgColor, noPadding, autoFocus, isRedShowMoreButton, handleClick } =
    props;

  const textRef = useRef<HTMLDivElement>(null);
  const hasMore = useHasMore(textRef, [text]);

  const [expanded, { toggle: toggleExpanded }] = useDisclosure(false);

  const { isEditMode, textModel, onSave, hideEditMode } = editTextProps;

  useEffect(() => {
    if (isEditMode && expanded) toggleExpanded();
  }, [isEditMode, expanded, toggleExpanded]);

  const handleCancel = () => {
    if (textModel.value !== text) textModel.setValue(text);

    hideEditMode?.();
  };

  const handleShowMoreButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    toggleExpanded();
  };

  return (
    <TextWrapper
      $bgColor={bgColor}
      $noPadding={noPadding}
      $isEditMode={isEditMode}
      $clickable={Boolean(handleClick)}
      onClick={handleClick}
    >
      {isEditMode ? (
        <FunctionalTextEditor
          model={textModel}
          autoFocus={autoFocus}
          variant="without-border"
          TextEditorControls={
            <TextEditorControls
              visibleSaveButton={textModel.value !== text}
              handleCancel={handleCancel}
              handleSave={onSave}
            />
          }
        />
      ) : (
        <InnerHTMLNormalizer
          ref={textRef}
          $expanded={expanded}
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }}
        />
      )}

      {hasMore && !isEditMode && (
        <ShowMoreButtonWrapper>
          <FeedItemShowMoreButton
            active={expanded}
            isRedButton={isRedShowMoreButton}
            onClick={handleShowMoreButtonClick}
          />
        </ShowMoreButtonWrapper>
      )}
    </TextWrapper>
  );
});

ResultBlock.displayName = 'ResultBlock';
export { ResultBlock };
