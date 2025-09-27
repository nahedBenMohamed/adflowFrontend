import { type Nullable } from '../types';

export const followElement = ({
  element,
  selector,
  options = { behavior: 'auto', block: 'nearest' },
}: {
  element: Nullable<HTMLElement>;
  selector: string;
  options?: ScrollIntoViewOptions;
}) => {
  setTimeout(() => {
    if (element) {
      const activeOption = element.querySelector(`[${selector}="true"]`);

      if (activeOption) activeOption.scrollIntoView(options);
    }
  });
};
