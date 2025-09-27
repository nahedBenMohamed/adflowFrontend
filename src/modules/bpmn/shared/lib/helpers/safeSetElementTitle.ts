import type { Nullable } from '@/shared';

export const safeSetElementTitle = ({
  element,
  title,
}: {
  element: Nullable<Element>;
  title: string;
}): void => {
  if (element) element.setAttribute('title', title);
};
