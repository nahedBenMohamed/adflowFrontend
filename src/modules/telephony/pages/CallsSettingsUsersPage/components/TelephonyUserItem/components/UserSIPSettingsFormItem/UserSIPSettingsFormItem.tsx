import { CopyButton } from '@/shared';
import styled, { css } from 'styled-components';

export const UserSIPSettingsFormItemRoot = styled.div`
  display: grid;
  grid-template-columns: 35% 65%;
`;

const Label = styled.div`
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const ValueWrapper = styled.div`
  display: flex;
`;

const Value = styled.div<{ $password?: boolean }>`
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding-left: 8px;
  word-break: break-all;

  ${p =>
    p.$password &&
    css`
      position: relative;

      font-family: var(--font-family-mono);

      &::after {
        content: '••••••••••••';

        position: absolute;
        inset: 0;
        left: 8px;

        background-color: var(--primary-statuses-white-0);
        transition: var(--transition-200);

        &:hover {
          cursor: pointer;
        }
      }

      &:hover::after {
        opacity: 0;

        z-index: -1;
      }
    `}
`;

interface Props {
  label: string;
  text: string;
  isPassword?: boolean;
}

const UserSIPSettingsFormItem = (props: Props) => {
  const { label, text, isPassword } = props;

  return (
    <UserSIPSettingsFormItemRoot>
      <Label>{label}</Label>

      <ValueWrapper>
        <CopyButton copyText={text} />
        <Value $password={isPassword}>{text}</Value>
      </ValueWrapper>
    </UserSIPSettingsFormItemRoot>
  );
};

export { UserSIPSettingsFormItem };
