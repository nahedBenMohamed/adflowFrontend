/* eslint-disable i18next/no-literal-string */

import { envUtil, FileFeedItem, UtcDate, UuidUtil } from '@/shared';
import { OneCLogo } from '../../../../../../../shared';
import { IntegrationInfoLink } from '../../../../IntegrationInfoLink/IntegrationInfoLink';
import { IntegrationInfoModalTemplate } from '../../../../IntegrationInfoModalTemplate/IntegrationInfoModalTemplate';
import { IntegrationInfoText } from '../../../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../../../../IntegrationInfoTitle/IntegrationInfoTitle';
import {
  IntegrationOrderedList,
  IntegrationOrderedListItem,
} from '../../../../IntegrationOrderedList/IntegrationOrderedList.styles';

interface Props {
  opened: boolean;
  hide: () => void;
  onApprove: () => void;
}

const OneCManualModal = (props: Props) => {
  const { opened, hide, onApprove } = props;

  return (
    <IntegrationInfoModalTemplate
      hideCancel
      isOpened={opened}
      Icon={<OneCLogo />}
      approveTitle="Закрыть"
      headerTitle="Интеграция Mywork с 1С: Управление торговлей"
      onClose={hide}
      onApprove={onApprove}
    >
      <IntegrationInfoTitle>
        Синхронизируйте номенклатуру, остатки на складе, сделки и контакты между 1С: Управление
        торговлей и Mywork.
      </IntegrationInfoTitle>

      <IntegrationInfoTitle>Шаг 1 — Подготовка Mywork</IntegrationInfoTitle>
      <IntegrationInfoText>
        В системе Mywork необходимо создать или выбрать существующий модуль «Склад», для которого
        будет настроена синхронизация с 1С: Управление торговлей. В этом модуле должен быть настроен
        как минимум один склад. Также необходимо создать или выбрать существующий модуль «Компании»,
        в котором должны быть настроены поля контактной информации контрагентов.
      </IntegrationInfoText>

      <IntegrationInfoLink
        label="Видеоинструкция «Настройка секции “Склад”»"
        to="https://youtu.be/c1GDqRLRIaM?si=MXU7wymsTe0jNir0"
      />
      <IntegrationInfoLink
        label="Видеоинструкция «Настройка секции “Компании”»"
        to="https://youtu.be/QAkMk2Fnp7w?si=LR95aeF7qr5XId3H"
      />

      <IntegrationInfoTitle>
        Шаг 2 — Установка расширения Mywork в 1С: Управление торговлей
      </IntegrationInfoTitle>

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>
          Откройте 1С: Управление торговлей в режиме конфигуратора
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>Откройте конфигурацию</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          Создайте резервную копию базы данных
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          Убедитесь, что среди активных пользователей остался только конфигуратор
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          В конфигурации добавьте новое расширение, уберите защиту от опасных действий и отключите
          безопасный режим
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          В созданное расширение загрузите конфигурацию из файла «Mywork_УТ_11_4_1.2.5.cfe»
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>Обновите конфигурацию базы данных</IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          Запустите 1С: Управление торговлей в пользовательском режиме
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          В левом боковом меню должен появиться раздел Mywork
        </IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <FileFeedItem
        file={{
          createdBy: -1,
          previewUrl: '',
          fileType: 'CFE',
          fileSize: 272446,
          createdAt: UtcDate.now(),
          fileId: UuidUtil.generate(),
          fileName: 'Mywork_УТ_11_4_1.2.5.cfe',
          downloadUrl: `${envUtil.appUrl}/files/1c/Mywork_УТ_11_4_1.2.5.cfe`,
        }}
        canDelete={false}
      />

      <IntegrationInfoLink
        label="Видеоинструкция «Установка расширения»"
        to="https://youtu.be/ZstEKfZdjGg?si=wEq9BMYzv2u_wZbZ"
      />

      <IntegrationInfoTitle>Шаг 3 — Настройка подключения к Mywork</IntegrationInfoTitle>

      <IntegrationInfoText>
        Следуйте инструкциям из видео, чтобы настроить передачу данных между Mywork и 1C.
      </IntegrationInfoText>

      <IntegrationInfoLink
        label="Видеоинструкция «Настройка подключения к порталу»"
        to="https://youtu.be/COTfW-5fAx0?si=1IJMZdoAnrojExaf"
      />
      <IntegrationInfoLink
        label="Видеоинструкция «Настройка секций товаров»"
        to="https://youtu.be/scjOf26jI0w?si=7_dFPnpdL98ix_ia"
      />
      <IntegrationInfoLink
        label="Видеоинструкция «Настройка пользователей»"
        to="https://youtu.be/xqhtNEJQ5dM?si=tFlsmwa14QVvxZgg"
      />
      <IntegrationInfoLink
        label="Видеоинструкция «Настройка видов цен»"
        to="https://youtu.be/Y_jFH08p61o?si=NCCjdaUwikM87uat"
      />
      <IntegrationInfoLink
        label="Видеоинструкция «Настройка складов»"
        to="https://youtu.be/3fRsDVjSMbc?si=liz0Pxfr5LKXdBJg"
      />
      <IntegrationInfoLink
        label="Видеоинструкция «Выгрузка номенклатуры»"
        to="https://youtu.be/11ILGhZN8So?si=9UYV5G5F-McJnblW"
      />
      <IntegrationInfoLink
        label="Видеоинструкция «Настройка компаний»"
        to="https://youtu.be/n86ApYTIhGs?si=eqhP038sPrmMHtUR"
      />

      <IntegrationInfoTitle>Шаг 4 — Запуск регламентного обмена</IntegrationInfoTitle>

      <IntegrationOrderedList>
        <IntegrationOrderedListItem>
          Запустите 1С: Управление торговлей в пользовательском режиме от имени администратора
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          Перейдите во вкладку «Администрирование» → «Печатные формы, отчеты и обработки» →
          «Дополнительные отчеты и обработки»
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          Добавьте внешнюю обработку «ОбменMywork.epf»
        </IntegrationOrderedListItem>
        <IntegrationOrderedListItem>
          Следуйте инструкциям из видео «Запуск регламентного обмена»
        </IntegrationOrderedListItem>
      </IntegrationOrderedList>

      <FileFeedItem
        file={{
          createdBy: -1,
          previewUrl: '',
          fileSize: 4666,
          fileType: 'EPF',
          createdAt: UtcDate.now(),
          fileName: 'ОбменMywork.epf',
          fileId: UuidUtil.generate(),
          downloadUrl: `${envUtil.appUrl}/files/1c/ОбменMywork.epf`,
        }}
        canDelete={false}
      />

      <IntegrationInfoLink
        label="Видеоинструкция «Запуск регламентного обмена»"
        to="https://youtu.be/sA0yHl88ykg?si=cfRC_itYNCb3qH40"
      />

      <IntegrationInfoTitle>Шаг 5 – Тестирование обмена</IntegrationInfoTitle>
      <IntegrationInfoText>
        Проверьте правильность выполнения всех шагов и успешность запуска обмена, следуя инструкциям
        из видео «Тестирование обмена».
      </IntegrationInfoText>

      <IntegrationInfoLink
        label="Видеоинструкция «Тестирование обмена»"
        to="https://youtu.be/0XERxYmXdtY?si=8tigLbsqwqjtBukk"
      />
    </IntegrationInfoModalTemplate>
  );
};

export { OneCManualModal };
