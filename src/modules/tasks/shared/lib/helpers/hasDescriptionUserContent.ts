export const hasDescriptionUserContent = (description: string): boolean => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, 'text/html');

  // convert the NodeList to an array and use forEach
  const elements = Array.from(doc.querySelectorAll('*'));

  // traverse the array and check if the element has text content
  for (const e of elements) {
    const textContent = e.textContent?.trim() || '';

    if (textContent.length > 0) return true;
  }

  return false;
};
