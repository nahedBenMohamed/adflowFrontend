/* eslint-disable i18next/no-literal-string */

import { PrimaryButton, type PrimaryButtonVariant } from '@/shared';
import { useDisclosure } from '@mantine/hooks';
import { TelephonySmallIcon } from '../../../../../shared';
import { IntegrationInfoLink } from '../../IntegrationInfoLink/IntegrationInfoLink';
import { IntegrationInfoModalTemplate } from '../../IntegrationInfoModalTemplate/IntegrationInfoModalTemplate';
import { IntegrationInfoText } from '../../IntegrationInfoText/IntegrationInfoText';
import { IntegrationInfoTitle } from '../../IntegrationInfoTitle/IntegrationInfoTitle';
import {
  IntegrationOrderedList,
  IntegrationOrderedListItem,
} from '../../IntegrationOrderedList/IntegrationOrderedList.styles';

interface Props {
  buttonVariant: PrimaryButtonVariant;
}

const TelephonyIntegrationGuideRU = (props: Props) => {
  const { buttonVariant } = props;

  const [opened, { close, open }] = useDisclosure(false);

  return (
    <>
      <PrimaryButton variant={buttonVariant} onClick={open}>
        Инструкция по интеграции Voximplant телефонии
      </PrimaryButton>

      {opened && (
        <IntegrationInfoModalTemplate
          hideCancel
          maxHeight="700px"
          isOpened={opened}
          approveTitle="Продолжить"
          Icon={<TelephonySmallIcon />}
          headerTitle="Инструкция по интеграции Voximplant телефонии"
          onClose={close}
        >
          <IntegrationInfoTitle>Инструкция по интеграции Voximplant телефонии</IntegrationInfoTitle>

          <IntegrationInfoTitle>Шаг 1 – Создание аккаунта</IntegrationInfoTitle>

          <IntegrationOrderedList>
            <IntegrationOrderedListItem>
              Для подключения интеграции Voximplant телефонии, вы должны перейти во вкладку
              «Настройки» → «Звонки» → «Аккаунт» и нажать на кнопку «Подключить телефонию».
            </IntegrationOrderedListItem>
            <IntegrationOrderedListItem>
              На странице появится информация о вашем созданном Voximplant аккаунте. Для того, чтобы
              завершить интеграцию, вам будет необходимо подтвердить аккаунт, нажав на ссылку
              «Подтвердить» в верхней части экрана.
            </IntegrationOrderedListItem>
          </IntegrationOrderedList>

          <IntegrationInfoTitle>Шаг 2 – Верификация аккаунта</IntegrationInfoTitle>

          <IntegrationInfoText>
            После перехода на портал Voximplant вам необходимо перейти во вкладку «Верификация» в
            левом меню и нажать на кнопку «Верифицировать аккаунт».
          </IntegrationInfoText>

          <IntegrationInfoLink
            label="Подробнее о верификации аккаунта"
            to="https://voximplant.ru/verification"
          />

          <IntegrationInfoText>
            Для того, чтобы пользоваться услугами Voximplant, вам понадобится:
          </IntegrationInfoText>

          <IntegrationOrderedList>
            <IntegrationOrderedListItem>Заполнить предложенную форму</IntegrationOrderedListItem>
            <IntegrationOrderedListItem>
              Скачать документы (Абонентский договор и Заказ)
            </IntegrationOrderedListItem>
            <IntegrationOrderedListItem>Подписать их</IntegrationOrderedListItem>
            <IntegrationOrderedListItem>Загрузить сканы</IntegrationOrderedListItem>
          </IntegrationOrderedList>

          <IntegrationInfoLink
            label="Сайт оператора и тарификация"
            to="https://voximplant.ru/pricing"
          />

          <IntegrationInfoTitle>Шаг 3 – Покупка номеров, начало работы</IntegrationInfoTitle>

          <IntegrationInfoText>
            После прохождения верификация вам будет необходимо предоставить в поддержку Mywork
            следующие данные, чтобы мы могли инициализировать вашу телефонию и подготовить ее к
            работе.
          </IntegrationInfoText>

          <IntegrationInfoLink label="support@mywork.app" to="mailto:support@mywork.app" />

          <IntegrationOrderedList>
            <IntegrationOrderedListItem>Город для выбора номера</IntegrationOrderedListItem>
            <IntegrationOrderedListItem>
              Рабочее время: в какие дни недели какое время рабочее, ваш часовой пояс
            </IntegrationOrderedListItem>
            <IntegrationOrderedListItem>
              Текст приветствия в начале звонка в рабочее время
            </IntegrationOrderedListItem>
            <IntegrationOrderedListItem>
              Текст сообщения при звонке в нерабочее время
            </IntegrationOrderedListItem>
            <IntegrationOrderedListItem>
              Вариант голоса для сообщения – мужской или женский
            </IntegrationOrderedListItem>
            <IntegrationOrderedListItem>
              Какое количество номеров будет необходимо
            </IntegrationOrderedListItem>
          </IntegrationOrderedList>

          <IntegrationInfoText>
            После получения данных мы обработаем ваш запрос в самое ближайшее время.
          </IntegrationInfoText>

          <IntegrationInfoTitle>Шаг 4 – Подключение номеров в Mywork</IntegrationInfoTitle>

          <IntegrationInfoText>
            После того, как вы пройдете верификацию и мы закупим для вас желаемые номера, вы увидите
            их во вкладке «Настройки» → «Звонки» → «Аккаунт». Для начала работы вам будем необходимо
            нажать кнопку «Подключить» напротив желаемых номеров и выбрать пользователей, которым
            эти номера будут доступны.
          </IntegrationInfoText>

          <IntegrationInfoText>
            Готово! Ваша телефония настроена и готова к использованию.
          </IntegrationInfoText>

          <IntegrationInfoTitle>Шаг 5 – Настройки, дополнительная информация</IntegrationInfoTitle>

          <IntegrationInfoText>
            Во вкладке «Настройки» → «Звонки» → «Пользователи» вы можете подключать и отключать
            пользователей системы к телефонии, просматривать SIP-данные. Во вкладке «Сценарии» вы
            можете настраивать сценарии интеграции телефонии с модулем CRM. Во вкладке «SIP
            регистрации» вы можете добавлять и управлять SIP регистрациями АТС/ВАТС.
          </IntegrationInfoText>

          <IntegrationInfoText>
            Имейте в виду, что при активном использовании телефонии рекомендуется периодически
            обновлять вкладку браузера, так как на неактивных вкладках (которые открыли больше 3
            дней назад и не взаимодействовали с ними) вы рискуете пропустить некоторые звонки.
          </IntegrationInfoText>

          <IntegrationInfoText>
            Более того, вы должны обязательно предоставить браузеру доступ к микрофону, чтобы
            совершать исходящие звонки.
          </IntegrationInfoText>

          <IntegrationInfoLink
            label="Предоставление доступа Google Chrome"
            to="https://support.google.com/chrome/answer/2693767?hl=ru&co=GENIE.Platform%3DDesktop"
          />
          <IntegrationInfoLink
            label="Предоставление доступа Mozilla Firefox"
            to="https://support.mozilla.org/ru/kb/upravlenie-razresheniyami-dlya-kamery-i-mikrofona-"
          />
          <IntegrationInfoLink
            label="Предоставление доступа Safari"
            to="https://support.apple.com/ru-ru/guide/mac-help/mchla1b1e1fe/mac"
          />

          <IntegrationInfoText>
            Как правило, браузер запросит у вас соответствующие разрешения автоматически при попытке
            совершить исходящий звонок.
          </IntegrationInfoText>
        </IntegrationInfoModalTemplate>
      )}
    </>
  );
};

export { TelephonyIntegrationGuideRU };
