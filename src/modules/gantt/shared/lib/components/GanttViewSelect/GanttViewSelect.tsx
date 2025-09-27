import {
  ArrowDropDownIcon,
  MyDropdown,
  SELECT_OPTION_ITEM_DATA_ACTIVE,
  SelectOptionItem,
  SelectOptionsList,
  SpanWithEllipsis,
  followElement,
  type Nullable,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState, type KeyboardEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGanttContext } from '../../../../context';
import type { GanttViewConfig } from '../../models';
import type { GanttView } from '../../types';

const Trigger = styled.button`
  position: absolute;
  top: 0;
  right: 0;

  height: 56px;
  min-width: 90px;

  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: var(--button-text-graphite-primary-text);

  padding: 0 8px 0 12px;
  background-color: var(--primary-statuses-white-0);
  border-left: 1px solid var(--graphite-graphite-80);
  border-top-right-radius: var(--border-radius-element);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;
  }
`;

const ArrowDropDownIconWrapper = styled.div<{ $active: boolean }>`
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  rotate: ${p => (p.$active ? '180deg' : '0')};
  transition: var(--transition-200);
`;

const GanttViewSelect = observer(() => {
  const { t } = useTranslation('page.tasks', {
    keyPrefix: 'tasks_page.tasks_page_timeline.view',
  });

  const { store, routeGenerator } = useGanttContext();
  const { viewConfig: sightConfig, viewConfigs: sightConfigs } = store;

  const navigate = useNavigate();

  const [containerRef, setContainerRef] = useState<Nullable<HTMLUListElement>>(null);

  const [opened, { close, open }] = useDisclosure(false);

  const [current, setCurrent] = useState(0);

  const getSelectHandler = useCallback(
    (item: GanttViewConfig) => () => {
      navigate(routeGenerator({ view: item.view }));

      close();
    },
    [navigate, routeGenerator, close]
  );

  const handleKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    e => {
      switch (e.key) {
        case 'ArrowUp':
          setCurrent(prev => (prev > 0 ? --prev : prev));

          followElement({ element: containerRef, selector: SELECT_OPTION_ITEM_DATA_ACTIVE });

          break;

        case 'ArrowDown':
          setCurrent(prev => (prev < sightConfigs.length - 1 ? ++prev : prev));

          followElement({ element: containerRef, selector: SELECT_OPTION_ITEM_DATA_ACTIVE });

          break;

        case 'Enter':
          const option = sightConfigs[current];

          if (option) getSelectHandler(option)();

          break;

        default:
          return;
      }
    },
    [current, containerRef, sightConfigs, getSelectHandler]
  );

  const { view: selectedView } = sightConfig;

  const getLabel = useCallback(
    (view: GanttView): string => {
      switch (view) {
        case 'fifteen-minutes':
          return t('fifteen_minutes');

        case 'hour':
          return t('hour');

        case 'day':
          return t('day');

        case 'week':
          return t('week');

        case 'month':
          return t('month');

        case 'quarter':
          return t('quarter');

        case 'half-year':
          return t('half_year');
      }
    },
    [t]
  );

  useEffect(() => {
    const currentIdx = sightConfigs.findIndex(s => s.view === selectedView);

    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setCurrent(currentIdx);

    if (opened) followElement({ element: containerRef, selector: SELECT_OPTION_ITEM_DATA_ACTIVE });
  }, [opened, containerRef, sightConfigs, selectedView]);

  return (
    <MyDropdown
      withinPortal
      opened={opened}
      position="bottom-end"
      dropdownMinWidth="184px"
      Button={
        <Trigger>
          <SpanWithEllipsis text={getLabel(selectedView)} />

          <ArrowDropDownIconWrapper $active={opened}>
            <ArrowDropDownIcon />
          </ArrowDropDownIconWrapper>
        </Trigger>
      }
      show={open}
      hide={close}
      onKeyDown={handleKeyDown}
    >
      <SelectOptionsList ref={setContainerRef} padding="8px">
        {sightConfigs.map((s, idx) => (
          <SelectOptionItem
            key={s.view}
            label={getLabel(s.view)}
            focused={idx === current}
            active={selectedView === s.view}
            onSelect={getSelectHandler(s)}
          />
        ))}
      </SelectOptionsList>
    </MyDropdown>
  );
});

GanttViewSelect.displayName = 'GanttViewSelect';
export { GanttViewSelect };
