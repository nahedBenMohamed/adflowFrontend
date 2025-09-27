import { generalSettingsStore } from '@/app';
import { envUtil, FileSizeWarningModal, MyInput, PrimaryButton, UrlUtil } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { observer } from 'mobx-react-lite';
import { useCallback, useRef, type ChangeEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { GeneralSettingsPageFormGroup } from '../GeneralSettingsPageFormGroup/GeneralSettingsPageFormGroup';
import { SettingsBlock } from '../SettingsBlock/SettingsBlock';

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const Domain = styled.div`
  position: absolute;
  right: 0;

  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: var(--button-text-graphite-secondary-text);
`;

const LogoControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  grid-row: 1 / 3;
  gap: 16px;

  margin: 0 auto;
`;

const LogoDescription = styled.p`
  font-size: 10px;
  font-weight: 500;
  line-height: 12px;
  color: var(--button-text-graphite-primary-text);
`;

const InputWrapper = styled.div`
  input {
    padding-right: 90px;
  }
`;

// in bytes (5mb)
const LOGO_MAX_SIZE = 5 * 1024 * 1024;

const GeneralSettingsPageTopBlock = observer(() => {
  const { t } = useTranslation('page.settings', {
    keyPrefix: 'settings_page.general_settings_page',
  });

  const { generalSettingsForm } = generalSettingsStore;

  const [fileSizeWarningOpened, { open: openFileSizeWarning, close: closeFileSizeWarning }] =
    useDisclosure(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const domain = `.${UrlUtil.removeHttpProtocol(envUtil.appUrl)}`;

  const handleSelectFile = useCallback<ChangeEventHandler<HTMLInputElement>>(
    e => {
      const target = e.target as HTMLInputElement;
      const targetFiles = target.files;

      const firstTargetFile = targetFiles?.[0];

      if (firstTargetFile) {
        if (firstTargetFile.size > LOGO_MAX_SIZE) {
          openFileSizeWarning();

          return;
        }

        generalSettingsStore.uploadAccountLogo(firstTargetFile);

        target.value = '';
      }
    },
    [openFileSizeWarning]
  );

  const handleRemoveAccountLogo = useCallback(() => {
    generalSettingsStore.removeAccountLogo();
  }, []);

  return (
    <>
      <SettingsBlock>
        <GeneralSettingsPageFormGroup gridRow="1" text={t('company')}>
          <MyInput disabled model={generalSettingsForm.companyName} hasBorderBottom />
        </GeneralSettingsPageFormGroup>

        <GeneralSettingsPageFormGroup gridRow="2" text={t('domain')}>
          <InputWrapper>
            <MyInput disabled model={generalSettingsForm.subdomain} hasBorderBottom />
          </InputWrapper>

          <Domain>{domain}</Domain>
        </GeneralSettingsPageFormGroup>

        <LogoControlsWrapper>
          <FlexWrapper>
            <PrimaryButton onClick={() => inputRef.current?.click()}>
              {t('upload_logo')}
            </PrimaryButton>

            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleSelectFile}
            />

            <PrimaryButton variant="empty-danger" onClick={handleRemoveAccountLogo}>
              {t('delete_logo')}
            </PrimaryButton>
          </FlexWrapper>

          <LogoDescription>{t('logo_caption')}</LogoDescription>
        </LogoControlsWrapper>
      </SettingsBlock>

      {fileSizeWarningOpened && (
        <FileSizeWarningModal
          maxSizeMb={5}
          isOpened={fileSizeWarningOpened}
          onClose={closeFileSizeWarning}
        />
      )}
    </>
  );
});

GeneralSettingsPageTopBlock.displayName = 'GeneralSettingsPageTopBlock';
export { GeneralSettingsPageTopBlock };
