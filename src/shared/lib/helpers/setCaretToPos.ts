import { setTextareaSelectionRange } from './setTextareaSelectionRange';

export const setCaretToPos = ({
  textarea,
  pos,
}: {
  textarea: HTMLTextAreaElement;
  pos: number;
}) => {
  setTextareaSelectionRange({ textarea, selectionStart: pos, selectionEnd: pos });
};
