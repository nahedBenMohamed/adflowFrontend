/**
 *  Returns text content from the first non-empty node in HTML string.
 *  If there is no text content, returns placeholder.
 *  If there is some other text, returns first line of it too.
 */
export const getNoteHeading = (
  content: string,
  placeholder: string
): { heading: string; firstLine?: string } => {
  let heading = '';
  let firstLine = '';

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;

  let currentNode = tempDiv.firstChild;

  while (currentNode) {
    const text = currentNode.textContent || '';

    if (text.trim().length > 0) {
      if (heading) {
        firstLine = text.trim();

        break;
      } else {
        heading = text.trim();
      }
    }

    currentNode = currentNode.nextSibling;
  }

  if (heading === '') heading = placeholder;

  return {
    heading: heading,
    firstLine: firstLine,
  };
};
