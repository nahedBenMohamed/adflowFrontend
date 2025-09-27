import {
  CheckmarkIcon,
  CopyContentWhiteIcon,
  InputModel,
  MyDatePickerWithTime,
  MyInput,
  PlusPrimaryIcon,
  PrimaryButton,
  SelectModel,
  UtcDate,
  type UtcDateValue,
  validateForm,
} from '@/shared';
import autoAnimate from '@formkit/auto-animate';
import { useClipboard, useDisclosure } from '@mantine/hooks';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { type CreateUserTokenDto, useCreateUserAccessToken } from '../../../../api';

interface RootProps {
  $opened?: boolean;
  $loading?: boolean;
}

const Root = styled.div<RootProps>`
  width: fit-content;
  min-height: 54px;

  display: flex;
  align-items: center;
  gap: 24px;

  padding: 8px 8px 8px 0;
  transition: var(--transition-200);

  ${p =>
    p.$opened &&
    css`
      padding: 8px;
      border: 1px solid var(--button-text-green-default);
      border-radius: var(--border-radius-block);
    `}

  ${p =>
    p.$loading &&
    css`
      cursor: wait;
      opacity: 0.7;
      pointer-events: none;
    `}
`;

const FormWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  white-space: nowrap;
  color: var(--button-text-graphite-primary-text);
`;

const CreateUserTokenBlock = observer(() => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.account_api_access_page.api_tokens_list',
  });

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current && autoAnimate(ref.current);
  }, [ref]);

  const { copy, copied } = useClipboard();

  const [isCreatingToken, { open: startCreatingToken, close: stopCreatingToken }] =
    useDisclosure(false);

  const { mutateAsync, data, isPending } = useCreateUserAccessToken();

  const form = useLocalObservable(() => ({
    name: InputModel.create().required(),
    expiresAt: SelectModel.create(),
  }));

  const handleCreateToken = useCallback(async () => {
    if (data) {
      copy(data.accessToken);
    } else if (isCreatingToken) {
      if (!validateForm(form)) return;

      const expiresAt = form.expiresAt.value as UtcDateValue;

      const dto: CreateUserTokenDto = {
        name: form.name.value,
        expiresAt: expiresAt?.formatISO(),
      };

      await mutateAsync(dto);

      stopCreatingToken();
    } else {
      startCreatingToken();
    }
  }, [copy, data, form, isCreatingToken, mutateAsync, startCreatingToken, stopCreatingToken]);

  return (
    <Root ref={ref} $opened={Boolean(isCreatingToken || data)} $loading={isPending}>
      {data && (
        <FormWrapper>
          <LabelWrapper>
            <Label>{t('access_token')}</Label>

            <MyInput model={InputModel.create(data.accessToken)} variant="outlined" readonly />
          </LabelWrapper>
        </FormWrapper>
      )}

      {isCreatingToken && (
        <FormWrapper>
          <LabelWrapper>
            <Label>{t('name')}</Label>

            <MyInput model={form.name} variant="outlined" />
          </LabelWrapper>

          <LabelWrapper>
            <Label>{t('expires_at')}</Label>

            <MyDatePickerWithTime model={form.expiresAt} disableDatesBefore={UtcDate.now()} />
          </LabelWrapper>
        </FormWrapper>
      )}

      <PrimaryButton
        iconProps={{
          Icon: copied ? <CheckmarkIcon /> : data ? <CopyContentWhiteIcon /> : <PlusPrimaryIcon />,
        }}
        loading={isPending}
        onClick={handleCreateToken}
      >
        {data ? t('copy') : t('add_user_token')}
      </PrimaryButton>
    </Root>
  );
});

CreateUserTokenBlock.displayName = 'CreateUserTokenBlock';
export { CreateUserTokenBlock };
