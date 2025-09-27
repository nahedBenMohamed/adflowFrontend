import {
  MiniLoader,
  MySelectStyledDropdown,
  SelectModel,
  SelectOptionItem,
  SelectOptionsList,
  useEditorOptimized,
  type InputModel,
  type Option,
} from '@/shared';
import { Menu } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { UnfoldIcon } from '../../../../../assets';
import type { MailboxSignature } from '../../../../models';
import { EditorContent } from './EditorContent';

const IconWrapper = styled.div<{ $visible: boolean }>`
  width: 6px;
  height: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: var(--transition-200);
  visibility: ${p => (p.$visible ? 'visible' : 'hidden')};

  &:hover {
    cursor: pointer;
  }
`;

const Editor = styled(RichTextEditor)<{ $minHeight: string }>`
  position: relative;

  min-height: ${p => p.$minHeight};

  border-top: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-color: var(--graphite-graphite-120);

  &:hover {
    ${IconWrapper} {
      visibility: visible;
    }
  }
`;

const SignaturesIconWrapper = styled.div`
  position: absolute;
  top: 2px;
  left: 6px;

  z-index: 1;
`;

const LoaderWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px 0;
`;

interface Props {
  model: InputModel;
  signatures: MailboxSignature[];
  loading?: boolean;
  minHeight?: string;
  firstSignatureDefaultSelected?: boolean;
}

const NO_SIGNATURE_VALUE = 'no_signature';

const EmailSignatureEditor = observer((props: Props) => {
  const { model, signatures, loading, minHeight = '264px', firstSignatureDefaultSelected } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.modals.send_email_modal.components.editors.email_signature_editor',
  });

  const activeSignatureModel = useLocalObservable<SelectModel>(() => SelectModel.create());

  const [opened, { toggle: toggleOpened, close: hide, open: show }] = useDisclosure(false);

  const onContentChange = useCallback((newValue: string) => model.setValue(newValue), [model]);

  const editor = useEditorOptimized({
    extensions: [
      Link,
      Underline,
      SubScript,
      Highlight,
      StarterKit,
      Superscript,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: t('placeholder') }),
    ],
    content: model.value,
    onUpdate: ({ editor }) => {
      // regexp below matches and replaces <p></p> tags, as well as <p> tags with styles to prevent issues
      // with breaks when rendering this html outside our editor
      onContentChange(editor.getHTML().replace(/<p(?:\s+style="[^"]*")?>\s*<\/p>/g, '<br/>'));
    },
  });

  useEffect(() => {
    const firstSignature = signatures[0];

    if (firstSignature && firstSignatureDefaultSelected)
      activeSignatureModel.value = firstSignature.id;
  }, [signatures, activeSignatureModel, firstSignatureDefaultSelected]);

  useEffect(() => {
    const signature = signatures.find(s => s.id === activeSignatureModel.value);

    if (signature) {
      editor.commands.setContent(signature.text);
      model.setValue(signature.text);
    } else if (activeSignatureModel.value === NO_SIGNATURE_VALUE) {
      editor.commands.setContent('');
      model.setValue('');
    }
  }, [activeSignatureModel.value, editor, signatures, model]);

  const signaturesOptions = useMemo<Option<number | typeof NO_SIGNATURE_VALUE>[]>(
    () => [
      {
        value: NO_SIGNATURE_VALUE,
        label: t('no_signature'),
      },
      ...signatures.map(s => ({
        label: s.name,
        value: s.id,
      })),
    ],
    [signatures, t]
  );

  const getSignatureChangeHandler = useCallback(
    (option: Option<number | typeof NO_SIGNATURE_VALUE>) => () => {
      activeSignatureModel.setValue(option.value);

      hide();
    },
    [activeSignatureModel, hide]
  );

  return (
    <Editor editor={editor} $minHeight={minHeight}>
      <SignaturesIconWrapper>
        <Menu
          opened={opened}
          position="bottom-start"
          zIndex="var(--dropdown-z-index)"
          onOpen={show}
          onClose={hide}
        >
          <Menu.Target>
            <IconWrapper $visible={opened} onClick={toggleOpened}>
              <UnfoldIcon />
            </IconWrapper>
          </Menu.Target>

          <MySelectStyledDropdown $width={256}>
            {loading ? (
              <LoaderWrapper>
                <MiniLoader />
              </LoaderWrapper>
            ) : (
              <SelectOptionsList maxHeight="320px" padding="8px">
                {signaturesOptions.map(s => (
                  <SelectOptionItem
                    key={s.value}
                    label={s.label}
                    onSelect={getSignatureChangeHandler(s)}
                    active={activeSignatureModel.value === s.value}
                  />
                ))}
              </SelectOptionsList>
            )}
          </MySelectStyledDropdown>
        </Menu>
      </SignaturesIconWrapper>

      <EditorContent $minHeight={minHeight} $padding="0 16px 16px" spellCheck />
    </Editor>
  );
});

EmailSignatureEditor.displayName = 'EmailSignatureEditor';
export { EmailSignatureEditor };
