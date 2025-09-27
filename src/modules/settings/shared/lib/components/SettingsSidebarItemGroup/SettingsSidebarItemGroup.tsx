import { memo } from 'react';
import styled from 'styled-components';
import { SettingsSidebarItem } from '../SettingsSidebarItem/SettingsSidebarItem';

const Root = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 8px;
`;

const Content = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 8px;
`;

export interface SettingsSidebarGroupIcon {
  name: string;
  to: string;
  active?: boolean;
}

interface Props {
  groupName: string;
  groupItems: SettingsSidebarGroupIcon[];
}

const SettingsSidebarItemGroup = memo((props: Props) => {
  const { groupName, groupItems } = props;

  return (
    <Root>
      <SettingsSidebarItem asElement="group-title">{groupName}</SettingsSidebarItem>

      <Content>
        {groupItems.map(g => (
          <SettingsSidebarItem key={g.to} to={g.to} active={g.active} asElement="group-member">
            {g.name}
          </SettingsSidebarItem>
        ))}
      </Content>
    </Root>
  );
});

export { SettingsSidebarItemGroup };
