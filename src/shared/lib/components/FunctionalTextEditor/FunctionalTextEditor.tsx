import { CARD_SAVED_EVENT } from '@/modules/card';
import { Transition } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { observer } from 'mobx-react-lite';
import {
  useCallback,
  useEffect,
  type CSSProperties,
  type ChangeEvent,
  type FocusEventHandler,
  type KeyboardEvent,
  type KeyboardEventHandler,
  type ReactNode,
  type Ref,
} from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { insertBrTagsInsteadEmptyPs, removeBrTagsFromStr } from '../../helpers';
import { useEditorOptimized } from '../../hooks';
import { InnerHTMLNormalizerMixin } from '../../mixins';
import type {
  FTEShowHTMLProps,
  FileInfo,
  FileModel,
  InputModel,
  MyInputVariant,
} from '../../models';
import type { Nullable } from '../../types';
import { InputBlockFileList } from '../FileInput/components';
import { MyTextArea } from '../Form/MyTextarea/MyTextArea';
import { MyMacScrollbar } from '../MyMacScrollbar/MyMacScrollbar';
import {
  AddFileControl,
  FormatTextControl,
  InsertEmojiControl,
  RightButton,
  Toolbar,
  type RightButtonIconType,
} from './components';

interface RootProps {
  $disabled?: boolean;
  $hiddenlyDisabled?: boolean;
  $maxHeight?: CSSProperties['maxHeight'];
}

const Root = styled.div<RootProps>`
  ${p => p.$maxHeight && `max-height: ${p.$maxHeight}`};

  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${p =>
    p.$disabled &&
    css`
      pointer-events: none;

      opacity: 0.8;
    `}

  ${p => p.$hiddenlyDisabled && `pointer-events: none`};
`;

const Editor = styled(RichTextEditor)`
  border: none;

  height: 100%;
`;

const ContentWrapper = styled.div`
  position: relative;
`;

type Variant = MyInputVariant | 'without-border';

interface ContentProps {
  $minHeight?: string;
  $maxHeight?: string;
  $resolved: boolean;
  $hasIcon: boolean;
  $variant: Variant;
  $invalid: boolean;
}

const Content = styled(RichTextEditor.Content)<ContentProps>`
  padding: 0;
  margin-bottom: 8px;

  .ProseMirror {
    min-height: ${p => p.$minHeight};
    max-height: ${p => p.$maxHeight};
    ${p =>
      (p.$minHeight || p.$maxHeight) &&
      css`
        overflow-y: auto;
      `}

    padding: 0;
    color: ${p =>
      p.$resolved
        ? 'var(--button-text-graphite-secondary-text)'
        : 'var(--button-text-graphite-priory-text)'};
    transition: border var(--transition-200);

    border-bottom: 1px solid
      ${p => (p.$invalid ? 'var(--button-text-red-hover)' : 'var(--graphite-graphite-120)')};

    ${p =>
      (p.$variant === 'filled' || p.$variant === 'outlined') &&
      css`
        padding: 3px 8px;
        border-radius: var(--border-radius-element);
      `};

    ${p =>
      p.$variant === 'filled' &&
      css`
        background: #f8fafbd7;
        border: 1px solid ${p.$invalid ? 'var(--button-text-red-hover)' : 'transparent'};
      `}

    ${p =>
      p.$variant === 'outlined' &&
      css`
        border: 1px solid
          ${p.$invalid ? 'var(--button-text-red-hover)' : 'var(--graphite-graphite-120)'};
      `}

      ${p => p.$variant === 'without-border' && `border: none;`}
    
      // change placeholder color
    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);

      color: var(--button-text-graphite-secondary-text);
    }

    ${p => p.$hasIcon && `padding-right: 24px`};

    ${p =>
      p.$resolved &&
      css`
        h1,
        h2,
        h3,
        h4,
        code {
          color: var(--button-text-graphite-secondary-text);
        }
      `}

    ${p =>
      p.$variant !== 'filled' &&
      p.$variant !== 'outlined' &&
      p.$variant !== 'without-border' &&
      css`
        &:hover,
        &:focus {
          border-bottom: 1px solid var(--primary-statuses-green-520);
        }
      `}

    ${InnerHTMLNormalizerMixin}
  }
`;

const EditorSubControls = styled.div`
  position: relative;
`;

const IconsWrapper = styled.div`
  height: 24px;

  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const FileListWrapper = styled.div<{ $visible?: boolean }>`
  max-height: 200px;

  display: ${p => (p.$visible ? 'block' : 'none')};

  margin-top: 6px;
  overflow-x: hidden;
`;

const TextEditorControlsWrapper = styled.div`
  margin-left: auto;
`;

export interface EditorFileProps {
  filesLoading: boolean;
  files: FileInfo[] | FileModel[];
  fileErrors: Nullable<string[]>;
  hideFiles?: boolean;
  onFileDelete: (fileId: string) => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface Props {
  ref?: Ref<HTMLDivElement>;
  model: InputModel;
  resolved?: boolean;
  placeholder?: string;
  variant?: Variant;
  contentMinHeight?: string;
  contentMaxHeight?: string;
  invalid?: boolean;
  showSubControls?: boolean;
  showHTMLProps?: FTEShowHTMLProps;
  toolbarWithoutHeadings?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  rightButtonProps?: {
    iconType: RightButtonIconType;
    loading: boolean;
    visible: boolean;
    clearEditorOnClick?: boolean;
    disabled?: boolean;
    onClick: () => Promise<void> | void;
  };
  fileProps?: EditorFileProps;
  TextEditorControls?: ReactNode;
  hiddenlyDisabled?: boolean;
  savingTextWithoutHTML?: boolean;
  toolbarDefaultVisible?: boolean;
  hideToolbarContainer?: boolean;
  forceRootContentHeight?: boolean;
  handleChange?: (html: string) => void;
  onFocus?: FocusEventHandler<HTMLDivElement>;
  onBlur?: FocusEventHandler<HTMLDivElement>;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
}

const FunctionalTextEditor = observer((props: Props) => {
  const {
    ref,
    model,
    resolved = false,
    fileProps,
    variant = 'primary',
    contentMinHeight,
    contentMaxHeight,
    rightButtonProps,
    placeholder,
    invalid = false,
    showSubControls = true,
    showHTMLProps,
    disabled,
    autoFocus = false,
    TextEditorControls,
    hiddenlyDisabled,
    forceRootContentHeight,
    savingTextWithoutHTML,
    hideToolbarContainer,
    toolbarWithoutHeadings,
    toolbarDefaultVisible = false,
    handleChange,
    onFocus,
    onBlur,
    onKeyDown,
  } = props;

  const { t } = useTranslation();

  const [toolbarVisible, { toggle: toggleToolbar, close: hideToolbar }] =
    useDisclosure(toolbarDefaultVisible);

  // this is needed to close toolbar in cards when card is saved or canceled
  useEffect(() => {
    document.addEventListener(CARD_SAVED_EVENT, hideToolbar);

    return () => document.removeEventListener(CARD_SAVED_EVENT, hideToolbar);
  }, [hideToolbar]);

  const onChange = useCallback(
    (newValue: string) => {
      model.setValue(newValue);

      handleChange?.(newValue);
    },
    [model, handleChange]
  );

  const editor = useEditorOptimized(
    {
      autofocus: autoFocus ? model.value.length : false,
      extensions: [
        StarterKit,
        Underline,
        Link,
        Superscript,
        SubScript,
        Highlight,
        Placeholder.configure({ placeholder }),
      ],
      // https://github.com/ueberdosis/tiptap/issues/412
      // we need to remove previously inserted <br/> tags to preserve the consistent view
      content: removeBrTagsFromStr(model.value),
    },
    [placeholder, showHTMLProps, autoFocus]
  );

  useEffect(() => {
    if (!editor) return;

    editor.on('update', ({ editor }) => {
      if (savingTextWithoutHTML) {
        onChange(editor.getText());

        return;
      }

      // we need to insert <br/> tags to preserve the consistent view
      onChange(insertBrTagsInsteadEmptyPs(editor.getHTML()));
    });

    return () => {
      editor.off('update');
    };
  }, [editor, onChange, savingTextWithoutHTML]);

  const handleClearEditor = useCallback(() => {
    if (editor) editor.commands.setContent('');

    model.value = '';
  }, [editor, model]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);

      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && rightButtonProps) {
        e.preventDefault();

        rightButtonProps.onClick();
        handleClearEditor();
      }
    },
    [rightButtonProps, handleClearEditor, onKeyDown]
  );

  const handleRightButtonClick = useCallback(async (): Promise<void> => {
    await rightButtonProps?.onClick();

    if (rightButtonProps?.clearEditorOnClick) handleClearEditor();
  }, [rightButtonProps, handleClearEditor]);

  const textAreaVariant = variant !== 'without-border' ? variant : undefined;

  return (
    <Root
      ref={ref}
      $disabled={disabled}
      $hiddenlyDisabled={hiddenlyDisabled}
      $maxHeight={forceRootContentHeight ? contentMaxHeight : undefined}
    >
      <Editor editor={editor} onFocus={onFocus} onBlur={onBlur} onKeyDown={handleKeyDown}>
        <ContentWrapper spellCheck>
          {showHTMLProps && showHTMLProps.show ? (
            <MyTextArea
              model={model}
              variant={textAreaVariant}
              fontFamily="var(--font-family-mono)"
              maxRows={showHTMLProps.maxRows}
              minRows={showHTMLProps.minRows}
              placeholder={t('enter_html_markup')}
            />
          ) : (
            <Content
              spellCheck
              $invalid={invalid}
              $variant={variant}
              $resolved={resolved}
              $minHeight={contentMinHeight}
              $maxHeight={contentMaxHeight}
              $hasIcon={Boolean(rightButtonProps?.visible)}
            />
          )}

          {rightButtonProps && (
            <RightButton
              type={rightButtonProps.iconType}
              visible={rightButtonProps.visible}
              loading={rightButtonProps.loading}
              disabled={rightButtonProps.disabled}
              onClick={handleRightButtonClick}
            />
          )}
        </ContentWrapper>

        {!hideToolbarContainer && (
          <Transition
            mounted={toolbarVisible && !disabled && !showHTMLProps?.show}
            transition="fade"
          >
            {transitionStyles => (
              <div style={transitionStyles}>
                <Toolbar withoutHeadings={toolbarWithoutHeadings} />
              </div>
            )}
          </Transition>
        )}

        {showSubControls && !disabled && (
          <EditorSubControls>
            <IconsWrapper>
              {!showHTMLProps?.show && (
                <>
                  <FormatTextControl onClick={toggleToolbar} active={toolbarVisible} />
                  <InsertEmojiControl />
                </>
              )}

              {fileProps && (
                <AddFileControl
                  files={fileProps.files}
                  fileErrors={fileProps.fileErrors}
                  filesLoading={fileProps.filesLoading}
                  onFileChange={fileProps.onFileChange}
                  onFileDelete={fileProps.onFileDelete}
                />
              )}

              {TextEditorControls && (
                <TextEditorControlsWrapper>{TextEditorControls}</TextEditorControlsWrapper>
              )}
            </IconsWrapper>

            {fileProps && !fileProps.hideFiles && (
              <MyMacScrollbar>
                <FileListWrapper $visible={fileProps.files.length > 0}>
                  <InputBlockFileList
                    fileInfos={fileProps.files}
                    onDelete={fileProps.onFileDelete}
                  />
                </FileListWrapper>
              </MyMacScrollbar>
            )}
          </EditorSubControls>
        )}
      </Editor>
    </Root>
  );
});

FunctionalTextEditor.displayName = 'FunctionalTextEditor';
export { FunctionalTextEditor };
