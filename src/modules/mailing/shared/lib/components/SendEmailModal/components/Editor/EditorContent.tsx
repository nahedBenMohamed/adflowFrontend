import { InnerHTMLNormalizerMixin } from '@/shared/lib/mixins/InnerHTMLNormalizer.mixin';
import { RichTextEditor } from '@mantine/tiptap';
import styled from 'styled-components';

interface EditorContent {
  $minHeight?: string;
  $padding?: string;
}

export const EditorContent = styled(RichTextEditor.Content)<EditorContent>`
  .ProseMirror {
    min-height: ${p => p.$minHeight};

    padding: ${p => p.$padding || 0};

    // change placeholder color
    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);

      color: var(--button-text-graphite-secondary-text);
    }

    ${InnerHTMLNormalizerMixin};
  }
`;
