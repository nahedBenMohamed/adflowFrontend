import {
  MyTextArea,
  insertBrTagsInsteadEmptyPs,
  removeBrTagsFromStr,
  useEditorOptimized,
  type FTEShowHTMLProps,
  type InputModel,
} from '@/shared';
import { Transition } from '@mantine/core';
import { Link, RichTextEditor } from '@mantine/tiptap';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import SubScript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { observer } from 'mobx-react-lite';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { EditorContent } from './EditorContent';

const TEXTAREA_PADDING = '16px 16px 0';

const Editor = styled(RichTextEditor)<{ $minHeight: string }>`
  min-height: ${p => p.$minHeight};

  border-bottom: none;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-color: var(--graphite-graphite-120);
`;

const StyledToolbar = styled(RichTextEditor.Toolbar)`
  svg {
    stroke: var(--button-text-graphite-primary-text);
  }
`;

interface Props {
  showToolbar: boolean;
  contentModel: InputModel;
  minHeight?: string;
  stickyOffset?: number;
  showHTMLProps?: FTEShowHTMLProps;
}

const EmailTextEditor = observer((props: Props) => {
  const {
    showToolbar,
    contentModel,
    showHTMLProps,
    minHeight = '56px',
    stickyOffset = -16,
  } = props;

  const { t } = useTranslation('module.mailing', {
    keyPrefix: 'mailing.modals.send_email_modal.components.editors.email_text_editor',
  });

  const onChange = useCallback(
    (newValue: string) => contentModel.setValue(newValue),
    [contentModel]
  );

  const editor = useEditorOptimized(
    {
      extensions: [
        Underline,
        SubScript,
        Highlight,
        StarterKit,
        Superscript,
        Link.configure({
          isAllowedUri: (url, ctx) => ctx.defaultValidate(url) && url.startsWith('http'),
        }),
        TextAlign.configure({ types: ['heading', 'paragraph'] }),
        Placeholder.configure({ placeholder: t('placeholders.new_message') }),
      ],
      // https://github.com/ueberdosis/tiptap/issues/412
      // we need to remove previously inserted <br/> tags to preserve the consistent view
      content: removeBrTagsFromStr(contentModel.value),

      onUpdate: ({ editor }) => {
        // we need to insert <br/> tags to preserve the consistent view
        onChange(insertBrTagsInsteadEmptyPs(editor.getHTML()));
      },
    },
    [showHTMLProps]
  );

  return (
    <Editor editor={editor} $minHeight={minHeight}>
      <Transition mounted={showToolbar} transition="fade">
        {transitionStyles => (
          <StyledToolbar style={{ ...transitionStyles }} sticky stickyOffset={stickyOffset}>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Highlight />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
              <RichTextEditor.Subscript />
              <RichTextEditor.Superscript />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>
          </StyledToolbar>
        )}
      </Transition>

      {showHTMLProps && showHTMLProps.show ? (
        <MyTextArea
          variant="filled"
          model={contentModel}
          padding={TEXTAREA_PADDING}
          minRows={showHTMLProps.minRows}
          maxRows={showHTMLProps.maxRows}
          fontFamily="var(--font-family-mono)"
          backgroundColor="var(--primary-statuses-white-0)"
          placeholder={t('placeholders.enter_html_markup')}
        />
      ) : (
        <EditorContent $minHeight={minHeight} $padding={TEXTAREA_PADDING} spellCheck />
      )}
    </Editor>
  );
});

EmailTextEditor.displayName = 'EmailTextEditor';
export { EmailTextEditor };
