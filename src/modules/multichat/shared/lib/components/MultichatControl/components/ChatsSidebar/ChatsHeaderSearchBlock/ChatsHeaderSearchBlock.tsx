import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { OutlinedSearchInput, type InputModel } from '../../../../../../../../../shared';
import { renderChatButton } from '../../../../../helpers';
import type { ChatProvider } from '../../../../../models';

const Root = styled.div`
  height: var(--chats-header-search-block-height);

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 12px 16px;
`;

interface Props {
  model: InputModel;
  provider?: ChatProvider;
}

const ChatsHeaderSearchBlock = observer((props: Props) => {
  const { model, provider } = props;

  const { t } = useTranslation();

  const [value, setValue] = useState(model.value);

  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setValue(model.value);
  }, [model.value]);

  const handleChangeSearch = useCallback(
    (value: string) => {
      setValue(value);
      model.setValue(value);
    },
    [model]
  );

  return (
    <Root>
      <OutlinedSearchInput
        value={value}
        placeholder={t('search')}
        handleChange={handleChangeSearch}
      />

      {renderChatButton(provider)}
    </Root>
  );
});

ChatsHeaderSearchBlock.displayName = 'ChatsHeaderSearchBlock';
export { ChatsHeaderSearchBlock };
