import {
  FormItem,
  FormItemLabel,
  MyCheckbox,
  MyDrawer,
  MyDrawerHeaderTitle,
  TruncateMixin,
  type Optional,
} from '@/shared';
import {
  type Column,
  type ColumnDefTemplate,
  type HeaderContext,
  type Table,
} from '@tanstack/react-table';
import { useCallback, type ReactNode, type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ReportsColumnsIds } from '../../../../shared';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  overflow-x: hidden;
  padding: 12px 24px;
`;

const ColumnsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ColumnsGroupTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);
`;

const CheckboxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--button-text-graphite-priory-text);

  ${TruncateMixin}
`;

const CheckboxTitle = styled.span`
  ${TruncateMixin}
`;

const SubColumnsWrapper = styled.div<{ $withPadding?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${p => p.$withPadding && `padding-left: 24px`};
`;

interface Props<T> {
  opened: boolean;
  table: Table<T>;
  settingsButtonRef?: RefObject<HTMLButtonElement | null>;
  Controls?: ReactNode;
  hide: () => void;
}

const ReportSettingsDrawer = <T extends unknown>(props: Props<T>) => {
  const { opened, table, settingsButtonRef, Controls, hide } = props;

  const { t } = useTranslation('module.reporting', {
    keyPrefix: 'reporting.templates.components.report_settings_drawer',
  });

  const areAllSubColumnsVisible = useCallback(
    (groupColumn: Column<T, unknown>) => groupColumn.columns.every(lc => lc.getIsVisible()),
    []
  );

  const areSomeSubColumnsVisible = useCallback(
    (groupColumn: Column<T, unknown>) =>
      !areAllSubColumnsVisible(groupColumn) && groupColumn.columns.some(lc => lc.getIsVisible()),
    [areAllSubColumnsVisible]
  );

  const getToggleAllSubColumnsVisibilityHandler = useCallback(
    (groupColumn: Column<T, unknown>) => () => {
      const areAllVisible = areAllSubColumnsVisible(groupColumn);

      groupColumn.columns.forEach(lc => {
        lc.toggleVisibility(!areAllVisible);
      });
    },
    [areAllSubColumnsVisible]
  );

  const renderHeader = useCallback(
    ({
      header,
      fallback,
    }: {
      header: Optional<ColumnDefTemplate<HeaderContext<T, unknown>>>;
      fallback: string;
    }): ReactNode => {
      let headerValue = fallback;

      if (!header) return headerValue;

      try {
        // https://tanstack.com/table/v8/docs/api/core/column-def#header
        // @ts-ignore – for know it is impossible to know for sure whether header is a string or a function,
        // so we have to use this ts-ignore and this check to prevent runtime errors
        headerValue = typeof header === 'string' ? header.toString() : header();
      } catch (e) {
        return fallback;
      }

      return headerValue;
    },
    []
  );

  const columns = table.getAllColumns().filter(gc => gc.id !== ReportsColumnsIds.TITLE);
  const areColumnsWithSubColumns = table.getAllColumns().some(gc => gc.columns.length > 0);

  return (
    <MyDrawer
      width="540px"
      paddingBottom
      opened={opened}
      ensurePageSubheader
      Controls={Controls}
      buttonRef={settingsButtonRef}
      Header={<MyDrawerHeaderTitle>{t('table_settings')}</MyDrawerHeaderTitle>}
      hide={hide}
    >
      <Content>
        <FormItem gap="8px">
          <FormItemLabel $color="var(--button-text-graphite-primary-text)">
            {t('display_columns')}
          </FormItemLabel>
        </FormItem>

        {areColumnsWithSubColumns ? (
          columns.map((gc, idx) => (
            <ColumnsGroup key={`${gc.id}-${idx}`}>
              <CheckboxWrapper>
                <MyCheckbox
                  checked={areAllSubColumnsVisible(gc)}
                  indeterminate={areSomeSubColumnsVisible(gc)}
                  onChange={getToggleAllSubColumnsVisibilityHandler(gc)}
                />

                <ColumnsGroupTitle>
                  {renderHeader({
                    header: gc.columnDef.header,
                    fallback: gc.id,
                  })}
                </ColumnsGroupTitle>
              </CheckboxWrapper>

              {gc.columns.length > 0 && (
                <SubColumnsWrapper $withPadding>
                  {gc.columns.map(lc => (
                    <CheckboxWrapper key={lc.id}>
                      <MyCheckbox
                        checked={lc.getIsVisible()}
                        onChange={lc.getToggleVisibilityHandler()}
                      />

                      <CheckboxTitle>
                        {renderHeader({
                          header: lc.columnDef.header,
                          fallback: lc.id,
                        })}
                      </CheckboxTitle>
                    </CheckboxWrapper>
                  ))}
                </SubColumnsWrapper>
              )}
            </ColumnsGroup>
          ))
        ) : (
          <SubColumnsWrapper>
            {columns.map(lc => (
              <CheckboxWrapper key={lc.id}>
                <MyCheckbox
                  checked={lc.getIsVisible()}
                  onChange={lc.getToggleVisibilityHandler()}
                />

                <CheckboxTitle>
                  {renderHeader({
                    header: lc.columnDef.header,
                    fallback: lc.id,
                  })}
                </CheckboxTitle>
              </CheckboxWrapper>
            ))}
          </SubColumnsWrapper>
        )}
      </Content>
    </MyDrawer>
  );
};

export { ReportSettingsDrawer };
