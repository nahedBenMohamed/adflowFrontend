import {
  CommonQueryParams,
  GTMUtil,
  InputModel,
  LogoLink,
  UriCodingUtil,
  UrlUtil,
  envUtil,
  validateForm,
} from '@/shared';
import { FocusTrap } from '@mantine/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { authStore } from '../../../../store';
import { LoginButton } from '../LoginButton/LoginButton';
import { LoginInput } from '../LoginInput/LoginInput';
import { LoginOrDelimiter } from '../LoginOrDelimiter/LoginOrDelimiter';
import { SuggestionLink } from '../SuggestionLink/SuggestionLink';

const Root = styled.div`
  height: 100%;
  width: 100%;

  gap: 24px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.span`
  font-size: 18px;
  font-weight: 400;
  line-height: 32px;
  font-family: Nunito SemiBold;
  color: var(--graphite-graphite-840);

  margin-bottom: 12px;
`;

const InputWrapper = styled.div`
  width: 100%;
`;

const Form = styled.form`
  width: 100%;

  gap: 24px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ForgotPasswordLink = styled(Link)`
  width: fit-content;

  font-size: 16px;
  font-weight: 600;
  line-height: 28px;
  font-family: Nunito SemiBold;
  color: var(--button-text-green-default);
  transition: var(--transition-200);

  &:hover {
    color: var(--button-text-green-hover);
  }

  &:active {
    color: var(--button-text-green-active);
  }
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  font-family: Nunito;
  color: var(--button-text-red-default);

  margin-top: 20px;
`;

interface InitialForm {
  email: InputModel;
  password: InputModel;
}

const LoginForm = observer(() => {
  const { t } = useTranslation('page.login', {
    keyPrefix: 'login.login_form',
  });

  const [searchParams] = useSearchParams();

  const redirectPathFromParams = searchParams.get(CommonQueryParams.REDIRECT_PATH);

  const searchParamsWithoutRedirectPath = new URLSearchParams(searchParams);
  searchParamsWithoutRedirectPath.delete(CommonQueryParams.REDIRECT_PATH);

  const redirectPath = redirectPathFromParams ? UriCodingUtil.decode(redirectPathFromParams) : null;

  const form = useLocalObservable<InitialForm>(() => ({
    email: InputModel.create().email(t('invalid_email_error')).required(),
    password: InputModel.create().required(),
  }));

  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GTMUtil.sendAnalyticsEvent('login_start');
  }, []);

  const onSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!validateForm(form)) return;

    const isValidEmail = form.email.value && form.email.validate();
    const isValidPassword = Boolean(form.password.value);

    if (!isValidEmail || !isValidPassword) {
      if (!isValidEmail) form.email.showError(t('invalid_email_error'));

      if (!isValidPassword) form.password.showError(t('invalid_password_error'));

      return;
    }

    try {
      setLoading(true);

      const redirectUrl = await authStore.login({
        redirectPath,
        email: form.email.trimmedValue,
        password: form.password.trimmedValue,
        searchParams: searchParamsWithoutRedirectPath.toString(),
      });

      if (redirectUrl) {
        GTMUtil.sendAnalyticsEvent('login');

        setIsError(false);

        window.location.href = redirectUrl;
      } else {
        setIsError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Root>
      <LogoLink href={envUtil.appUrl} large />
      <Title>{t('title')}</Title>
      <FocusTrap>
        <Form onSubmit={onSubmit}>
          <InputWrapper>
            <LoginInput model={form.email} placeholder={t('placeholders.login')} />
          </InputWrapper>

          <InputWrapper>
            <LoginInput
              model={form.password}
              type="password"
              placeholder={t('placeholders.password')}
            />
          </InputWrapper>

          <ForgotPasswordLink
            target="_blank"
            rel="noopener noreferrer"
            to={`${envUtil.appUrl}/request-recovery`}
          >
            {t('forgot_your_password')}
          </ForgotPasswordLink>

          <LoginButton loading={loading} name={t('login')} />

          {isError && <ErrorMessage>{t('invalid')}</ErrorMessage>}
        </Form>
      </FocusTrap>

      <LoginOrDelimiter caption={t('or')} />

      <SuggestionLink
        caption={t('caption')}
        linkTitle={t('sign_up')}
        href={`${UrlUtil.getBaseDomainWithProtocol()}/signup`}
      />
    </Root>
  );
});

export { LoginForm };
