import { RichTextEditor, useRichTextEditorContext } from '@mantine/tiptap';
import styled from 'styled-components';
import { MyEmojiPicker } from '../../../../MyEmojiPicker/MyEmojiPicker';

const StyledControl = styled(RichTextEditor.Control)`
  border: none;

  height: 20px;
  width: fit-content;

  &[data-interactive]:hover {
    background-color: transparent;
  }
`;

const InsertEmojiControl = () => {
  const { editor } = useRichTextEditorContext();

  const onSelect = (emojiData: EmojiMartData) => {
    if (editor) {
      editor.commands.insertContent(emojiData.native);
    }
  };

  return (
    <MyEmojiPicker
      position="right-start"
      withinPortal
      zIndex={1500}
      ButtonWrapper={StyledControl}
      onSelect={onSelect}
    />
  );
};

export { InsertEmojiControl };
