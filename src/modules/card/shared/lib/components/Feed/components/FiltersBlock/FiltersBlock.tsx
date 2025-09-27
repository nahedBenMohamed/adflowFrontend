import { voximplantConnectorStore } from '@/modules/telephony';
import { EntityCategory, FeatureCode, FeedItemFilter, type EntityType } from '@/shared';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

const Root = styled.div<{ $scrolled: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;

  text-align: center;

  padding: 14px 0 16px;
  border-bottom: 1px solid transparent;
  background-color: var(--graphite-graphite-20);
  transition: var(--transition-200);

  @media (max-width: 1200px) {
    gap: 24px;
  }

  ${p => p.$scrolled && `border-color: var(--graphite-graphite-80)`};
`;

const Item = styled.span<{ $active: boolean }>`
  height: 30px;

  display: flex;
  align-items: center;

  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: var(--button-text-graphite-secondary-text);
  transition: var(--transition-200);

  &:hover {
    cursor: pointer;

    color: var(--button-text-graphite-primary-text);
  }

  &:active {
    color: var(--button-text-graphite-secondary-text);
  }

  ${p =>
    p.$active &&
    css`
      color: var(--button-text-green-active);

      &:hover {
        color: var(--button-text-green-hover);
      }
    `}
`;

interface FilterType {
  name: string;
  code: FeedItemFilter;
}

interface Props {
  isScrolled: boolean;
  activeType: string;
  entityType: EntityType;
  activeFeatureCodes: FeatureCode[];
  onChange: (type: FeedItemFilter) => void;
}

const FiltersBlock = observer((props: Props) => {
  const { isScrolled, activeType, entityType, activeFeatureCodes, onChange } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.filter',
  });

  const { connectedToVoximplant, loggedIn } = voximplantConnectorStore;

  const isTelephonyActive = connectedToVoximplant && loggedIn;

  const showCallFilter = useMemo(
    () =>
      [EntityCategory.DEAL, EntityCategory.COMPANY, EntityCategory.CONTACT].includes(
        entityType.entityCategory
      ),
    [entityType.entityCategory]
  );

  const types = useMemo<FilterType[]>(() => {
    const finalTypes: FilterType[] = [
      {
        code: FeedItemFilter.ALL,
        name: t('all'),
      },
    ];

    if (activeFeatureCodes.includes(FeatureCode.TASK))
      finalTypes.push({
        code: FeedItemFilter.TASKS,
        name: t('tasks'),
      });

    if (activeFeatureCodes.includes(FeatureCode.ACTIVITY))
      finalTypes.push({
        code: FeedItemFilter.ACTIVITIES,
        name: t('activities'),
      });

    if (activeFeatureCodes.includes(FeatureCode.NOTE))
      finalTypes.push({
        code: FeedItemFilter.NOTES,
        name: t('notes'),
      });

    finalTypes.push({
      code: FeedItemFilter.MAIL,
      name: t('mail'),
    });

    if (
      activeFeatureCodes.includes(FeatureCode.NOTE) ||
      activeFeatureCodes.includes(FeatureCode.TASK)
    )
      finalTypes.push({
        code: FeedItemFilter.FILES,
        name: t('files'),
      });

    if (isTelephonyActive && showCallFilter)
      finalTypes.push({
        code: FeedItemFilter.CALLS,
        name: t('calls'),
      });

    return finalTypes;
  }, [activeFeatureCodes, isTelephonyActive, showCallFilter, t]);

  return (
    <Root $scrolled={isScrolled}>
      {types.map(t => (
        <Item key={t.code} $active={activeType === t.code} onClick={() => onChange(t.code)}>
          {t.name}
        </Item>
      ))}
    </Root>
  );
});

FiltersBlock.displayName = 'FiltersBlock';
export { FiltersBlock };
