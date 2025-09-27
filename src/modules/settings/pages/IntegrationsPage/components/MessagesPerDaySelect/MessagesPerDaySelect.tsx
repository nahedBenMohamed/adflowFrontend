import {
  Hint,
  MyInputNumber,
  MySelect,
  NumberModel,
  type Option,
  type SelectModel,
} from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { type MouseEventHandler, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { IntegrationFormGroup } from '../IntegrationFormGroup/IntegrationFormGroup';

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AnnotationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 400;
  line-height: 16px;
  color: var(--button-text-graphite-priory-text);
`;

interface Props {
  model: SelectModel;
}

const MessagesPerDaySelect = observer((props: Props) => {
  const { model } = props;

  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.integrations_page.ui.messages_per_day_select',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const inputNumberModel = useLocalObservable(() => NumberModel.create(model.value));

  const [opened, { open: show, close: hide }] = useDisclosure(false);

  const handleClickInput = useCallback<MouseEventHandler<HTMLInputElement>>(() => {
    show();

    setTimeout(() => inputRef.current?.focus(), 60);
  }, [show]);

  const isInvalid = useMemo<boolean>(
    () => !inputNumberModel.value || inputNumberModel.value < 1 || inputNumberModel.value > 1e6,
    [inputNumberModel.value]
  );

  const options = [10, 20, 50, 100, 200, 300, 400, 500].map<Option<number>>(i => ({
    label: String(i),
    value: i,
  }));

  return (
    <IntegrationFormGroup label={t('label')}>
      <Content>
        <MySelect
          width="70px"
          titleGap="8px"
          withinPortal
          titleMinWidth={0}
          searchBar={false}
          options={options}
          model={model}
          handleChange={inputNumberModel.setValue}
          overrideShowHideHandlers={{
            opened,
            show,
            hide,
          }}
          CustomButton={
            <MyInputNumber
              ref={inputRef}
              width="70px"
              variant="outlined"
              min={0}
              max={1e6}
              model={inputNumberModel}
              invalid={isInvalid}
              handleChange={model.setValue}
              onClick={handleClickInput}
            />
          }
        />

        <AnnotationWrapper>
          {t('annotation')} <Hint text={t('hint')} />
        </AnnotationWrapper>
      </Content>
    </IntegrationFormGroup>
  );
});

MessagesPerDaySelect.displayName = 'MessagesPerDaySelect';
export { MessagesPerDaySelect };
