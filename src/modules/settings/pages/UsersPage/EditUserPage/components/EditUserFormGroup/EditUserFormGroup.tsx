import { FormGroup, Hint, Label } from '@/shared';
import type { ReactNode } from 'react';

interface Props {
  text: string;
  children: ReactNode;
  hint?: string;
}

export const EDIT_USER_FORM_GROUP_GRID = 'calc(40% - 8px) calc(60% - 8px)';

const EditUserFormGroup = (props: Props) => {
  const { text, children, hint } = props;

  return (
    <FormGroup
      $gap="8px"
      $noEllipsis
      $alignItems="flex-start"
      $gridTemplateColumns={EDIT_USER_FORM_GROUP_GRID}
    >
      <Label $noEllipsis $color="var(--button-text-graphite-primary-text)">
        <p>
          <span>{text}</span>

          {hint && (
            <>
              {' '}
              <Hint text={hint} as="span" />
            </>
          )}
        </p>
      </Label>

      {children}
    </FormGroup>
  );
};

export { EditUserFormGroup };
