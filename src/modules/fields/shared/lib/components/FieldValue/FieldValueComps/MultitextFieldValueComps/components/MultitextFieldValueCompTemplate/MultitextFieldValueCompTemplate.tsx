import { TruncateMixin } from '@/shared';
import { memo, type ReactNode } from 'react';
import styled from 'styled-components';
import type { FieldSettings } from '../../../../../../models';
import { FieldValueTemplate } from '../../../../FieldValueTemplate';
import { MultitextInputWrapper } from '../MultitextInputWrapper/MultitextInputWrapper';

const Content = styled.div`
  width: 100%;
  min-height: var(--field-component-height);

  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;

  ${TruncateMixin}
`;

interface Props {
  children: ReactNode;
  filled: boolean;
  tableView?: boolean;
  fieldSettings?: FieldSettings;
  alwaysHideIndicator?: boolean;
  rightIndicatorOnMobile?: boolean;
}

const MultitextFieldValueCompTemplate = memo((props: Props) => {
  const {
    children,
    filled,
    tableView,
    fieldSettings,
    alwaysHideIndicator,
    rightIndicatorOnMobile,
  } = props;

  return (
    <FieldValueTemplate
      filled={filled}
      tableView={tableView}
      settings={fieldSettings}
      alwaysHideIndicator={alwaysHideIndicator}
      rightIndicatorOnMobile={rightIndicatorOnMobile}
    >
      <MultitextInputWrapper>
        <Content>{children}</Content>
      </MultitextInputWrapper>
    </FieldValueTemplate>
  );
});

MultitextFieldValueCompTemplate.displayName = 'MultitextFieldValueCompTemplate';
export { MultitextFieldValueCompTemplate };
