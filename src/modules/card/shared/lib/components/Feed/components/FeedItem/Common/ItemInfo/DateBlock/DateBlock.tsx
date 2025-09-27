import { CalendarEndDateIcon, CalendarIcon, type UtcDate } from '@/shared';
import { useTranslation } from 'react-i18next';
import { InfoBlock, type FrameVariant, type IndicatorVariant } from '../InfoBlock/InfoBlock';

interface Props {
  title: string;
  date: UtcDate;
  hideTime?: boolean;
  isEndDate?: boolean;
  isResolvedTask?: boolean;
  frameVariant?: FrameVariant;
  indicatorVariant?: IndicatorVariant;
}

const DateBlock = (props: Props) => {
  const {
    title,
    date,
    hideTime,
    isEndDate,
    isResolvedTask,
    frameVariant = 'outlined',
    indicatorVariant,
  } = props;

  const { t } = useTranslation('component.card', {
    keyPrefix: 'card.ui.feed.common',
  });

  return (
    <InfoBlock
      title={title}
      frameVariant={frameVariant}
      isResolvedTask={isResolvedTask}
      indicatorVariant={indicatorVariant}
      info={
        hideTime
          ? date.format('D MMM')
          : t('created_at', { day: date.format('D MMM'), time: date.displayTime() })
      }
    >
      {isEndDate ? <CalendarEndDateIcon /> : <CalendarIcon />}
    </InfoBlock>
  );
};

export { DateBlock };
