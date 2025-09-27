interface InsertResult {
  resultText: string;
  selectionStart: number;
}

export const insertTextAtCaret = ({
  textarea,
  text,
}: {
  textarea: HTMLTextAreaElement;
  text: string;
}): InsertResult => {
  const cursorPosition = textarea.selectionStart;

  const textBeforeCursorPosition = textarea.value.substring(0, cursorPosition);
  const textAfterCursorPosition = textarea.value.substring(cursorPosition, textarea.value.length);

  const resultText = textBeforeCursorPosition + text + textAfterCursorPosition;

  return {
    resultText,
    selectionStart: cursorPosition + text.length,
  };
};
