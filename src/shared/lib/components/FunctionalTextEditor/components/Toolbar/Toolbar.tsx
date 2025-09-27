import { RichTextEditor } from '@mantine/tiptap';
import { memo } from 'react';
import styled from 'styled-components';

const Root = styled(RichTextEditor.Toolbar)`
  padding: 0;
  border-bottom: none;
  margin-bottom: 8px;

  svg {
    stroke: var(--button-text-graphite-primary-text);
  }
`;

interface Props {
  withoutHeadings?: boolean;
}

const Toolbar = memo((props: Props) => {
  const { withoutHeadings } = props;

  return (
    <Root>
      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Bold />
        <RichTextEditor.Italic />
        <RichTextEditor.Underline />
        <RichTextEditor.Strikethrough />
        <RichTextEditor.Highlight />
        <RichTextEditor.Code />
        <RichTextEditor.ClearFormatting />
      </RichTextEditor.ControlsGroup>

      {!withoutHeadings && (
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>
      )}

      <RichTextEditor.ControlsGroup>
        <RichTextEditor.Blockquote />

        {!withoutHeadings && <RichTextEditor.Hr />}

        <RichTextEditor.BulletList />
        <RichTextEditor.OrderedList />
        <RichTextEditor.Subscript />
        <RichTextEditor.Superscript />
      </RichTextEditor.ControlsGroup>
    </Root>
  );
});

Toolbar.displayName = 'Toolbar';
export { Toolbar };
