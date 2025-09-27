import { routes } from '@/app';
import { authStore } from '@/modules/auth';
import { AddPlaceholderTemplate } from '@/modules/products';
import { departmentsSettingsStore, type Department } from '@/modules/settings';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useMemo, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useDropdownWidth } from '../../hooks';
import { DropdownScrollbarMixin } from '../../mixins';
import { MultiselectModel, SelectModel, type MySelectTitleRootVariant } from '../../models';
import type { Optional } from '../../types';
import { MySelectCustomTemplate } from '../Form/MySelect/MySelectCustomTemplate/MySelectCustomTemplate';
import { NoOptionsMessage } from '../Form/MySelect/components';
import { DepartmentsSelectItem, type DepartmentsSelectItemProps } from './components';

const Root = styled.div`
  max-height: 320px;

  ${DropdownScrollbarMixin}

  padding: 0;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

interface ShowHideHandlers {
  opened: boolean;
  show: () => void;
  hide: () => void;
}

interface Props<M extends SelectModel | MultiselectModel<number>> {
  model: M;
  departments: Department[];
  width?: CSSProperties['width'];
  maxWidth?: CSSProperties['maxWidth'];
  withinPortal?: boolean;
  includeArray?: number[];
  placeholder?: string;
  fixedDropdownWidth?: number;
  variant?: MySelectTitleRootVariant;
  overrideShowHideHandlers?: ShowHideHandlers;
  handleChange?: M extends SelectModel
    ? (selectedId: number) => void
    : (selectedIds: number[]) => void;
  onClear?: () => void;
}

const DepartmentsSelect = observer(
  <M extends SelectModel | MultiselectModel<number>>(props: Props<M>) => {
    const {
      model,
      departments,
      width,
      maxWidth,
      withinPortal,
      includeArray,
      placeholder,
      fixedDropdownWidth,
      variant,
      overrideShowHideHandlers,
      handleChange,
      onClear,
    } = props;

    const { t } = useTranslation();

    const [opened, { close, open }] = useDisclosure(false);

    const { user: currentUser } = authStore;
    const { departmentsAndSubdepartments, getDepartmentsByIds, getById } = departmentsSettingsStore;

    const showAddPlaceholder = includeArray
      ? departmentsAndSubdepartments.filter(d => includeArray.includes(d.id)).length === 0
      : departments.length === 0;

    const [dropdownWidth, ref] = useDropdownWidth();

    const menuShowHideProps = useMemo<ShowHideHandlers>(
      () =>
        overrideShowHideHandlers
          ? overrideShowHideHandlers
          : {
              opened,
              show: open,
              hide: close,
            },
      [overrideShowHideHandlers, opened, open, close]
    );

    const onSelect = useCallback(
      (value: number) => {
        if (model instanceof SelectModel) {
          model.setValue(value);

          handleChange?.(model.value);

          menuShowHideProps.hide();
        } else if (model instanceof MultiselectModel) {
          model.setValue([...model.values, value]);

          (handleChange as (selectedIds: number[]) => void)?.(model.values);
        }

        model.validate();
      },
      [model, handleChange, menuShowHideProps]
    );

    const onCancel = useCallback(
      (value: number) => {
        if (model instanceof MultiselectModel) {
          model.setValue(model.values.filter(v => v !== value));

          (handleChange as (selectedIds: number[]) => void)?.(model.values);
        }
      },
      [model, handleChange]
    );

    const getCommonProps = useCallback(
      (department: Department) =>
        ({
          department,
          active:
            model instanceof MultiselectModel
              ? model.values.includes(department.id)
              : model.value === department.id,
          includeArray,
          onSelect,
          onCancel,
        }) satisfies Partial<DepartmentsSelectItemProps>,
      [model, includeArray, onSelect, onCancel]
    );

    const label: Optional<string> =
      model instanceof SelectModel
        ? model.value
          ? getById(model.value).name
          : undefined
        : model.values.length > 0
          ? getDepartmentsByIds(model.values)
              .map(d => d.name)
              .join(', ')
          : undefined;

    return (
      <MySelectCustomTemplate
        ref={ref}
        label={label}
        variant={variant}
        titleWidth={width}
        titleMaxWidth={maxWidth}
        invalid={!model.isValid}
        withinPortal={withinPortal}
        opened={menuShowHideProps.opened}
        width={fixedDropdownWidth ? fixedDropdownWidth : dropdownWidth}
        placeholder={
          (placeholder ?? model instanceof SelectModel) ? t('select_group') : t('select_groups')
        }
        show={menuShowHideProps.show}
        hide={menuShowHideProps.hide}
        onClear={label ? onClear : undefined}
      >
        {showAddPlaceholder ? (
          currentUser?.isAdmin() ? (
            <AddPlaceholderTemplate
              title={t('add_new_group')}
              link={routes.settingsDepartments()}
            />
          ) : (
            <NoOptionsMessage>{t('no_available_groups')}</NoOptionsMessage>
          )
        ) : (
          <Root>
            {departments.map(d => (
              <ListWrapper key={d.id}>
                <DepartmentsSelectItem {...getCommonProps(d)} />

                {d.subordinates.map(s => (
                  <DepartmentsSelectItem key={s.id} {...getCommonProps(s)} isSubdepartment />
                ))}
              </ListWrapper>
            ))}
          </Root>
        )}
      </MySelectCustomTemplate>
    );
  }
);

DepartmentsSelect.displayName = 'DepartmentsSelect';
export { DepartmentsSelect };
