export const setTextareaSelectionRange = ({
  textarea,
  selectionStart,
  selectionEnd,
}: {
  textarea: HTMLTextAreaElement;
  selectionStart: number;
  selectionEnd: number;
}) => {
  textarea.focus();
  textarea.setSelectionRange(selectionStart, selectionEnd);
};
