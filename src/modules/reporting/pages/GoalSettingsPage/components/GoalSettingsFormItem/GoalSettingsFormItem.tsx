import { InputModel, MyInput, SpanWithEllipsis, TruncateMixin } from '@/shared';
import styled from 'styled-components';
import type { FormGroupType } from '../../../../shared';
import { GroupIcon } from '../GroupIcon/GroupIcon';

const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  font-size: 12px;
`;

const GroupName = styled.div<{ $groupType: FormGroupType }>`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-grow: 1;

  font-size: ${p => (p.$groupType === 'subdepartment' ? '14px' : '16px')};
  font-weight: ${p => (p.$groupType === 'subdepartment' ? '600' : '700')};
  line-height: ${p => (p.$groupType === 'subdepartment' ? '20px' : '24px')};
  color: var(--button-text-graphite-priory-text);

  overflow: hidden;
`;

const UserName = styled.span`
  flex-grow: 1;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  padding: 0 0 0 24px;

  ${TruncateMixin}
`;

const IconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
`;

const InputWrapper = styled.div`
  width: 152px;
  height: 28px;

  flex-shrink: 0;
`;

interface Props {
  amount: number;
  quantity: number;
  showAmount: boolean;
  groupName?: string;
  userFullname?: string;
  groupType?: FormGroupType;
  onAmountChange?: (value: number) => void;
  onQuantityChange?: (value: number) => void;
}

const GoalSettingsFormItem = (props: Props) => {
  const {
    groupName,
    groupType,
    showAmount,
    userFullname,
    amount,
    quantity,
    onAmountChange,
    onQuantityChange,
  } = props;

  const amountModel = InputModel.create(String(amount));
  const quantityModel = InputModel.create(String(quantity));

  const handleAmountChange = (value: string) => {
    if (!onAmountChange) return;

    onAmountChange(Number(value));
  };

  const handleQuantityChange = (value: string) => {
    if (!onQuantityChange) return;

    onQuantityChange(Number(value));
  };

  return (
    <Root>
      {groupName && groupType && (
        <GroupName $groupType={groupType}>
          <IconWrapper>
            <GroupIcon iconType={groupType} />
          </IconWrapper>
          <SpanWithEllipsis text={groupName} />
        </GroupName>
      )}

      {userFullname && <UserName title={userFullname}>{userFullname}</UserName>}

      {showAmount && (
        <InputWrapper>
          <MyInput model={amountModel} variant="outlined" handleChange={handleAmountChange} />
        </InputWrapper>
      )}

      <InputWrapper>
        <MyInput model={quantityModel} variant="outlined" handleChange={handleQuantityChange} />
      </InputWrapper>
    </Root>
  );
};

GoalSettingsFormItem.displayName = 'GoalSettingsFormItem';
export { GoalSettingsFormItem };
