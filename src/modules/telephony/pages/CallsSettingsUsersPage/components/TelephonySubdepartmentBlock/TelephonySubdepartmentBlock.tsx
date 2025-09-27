import type { Department } from '@/modules/settings';
import { SubgroupIcon, TotalTag } from '@/shared';
import styled from 'styled-components';
import type { VoximplantUser } from '../../../../shared';
import { TelephonyUsersList } from '../TelephonyUsersList/TelephonyUsersList';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px;
`;

const SubdepartmentIconWrapper = styled.div`
  width: 16px;
  height: 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  users: VoximplantUser[];
  subdepartment: Department;
}

const TelephonySubdepartmentBlock = (props: Props) => {
  const { users, subdepartment } = props;

  return (
    <Root>
      <TitleWrapper>
        <SubdepartmentIconWrapper>
          <SubgroupIcon />
        </SubdepartmentIconWrapper>

        <Title>{subdepartment.name}</Title>

        <TotalTag total={users.length} />
      </TitleWrapper>

      <TelephonyUsersList users={users} />
    </Root>
  );
};

export { TelephonySubdepartmentBlock };
