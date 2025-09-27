import type { Preview } from '@storybook/react';
import { HttpStatusCode } from 'axios';
import { I18nDecorator } from '../src/app/config/storybook/I18nDecorator';
import { RouterDecorator } from '../src/app/config/storybook/RouterDecorator';
import { StyleDecorator } from '../src/app/config/storybook/StyleDecorator';

// Basic authentication logic
const SB_USERNAME = 'admin';
const SB_PASSWORD = 'amwork';

const inputUsername = window.prompt('Enter username:');
const inputPassword = window.prompt('Enter password:');

if (inputUsername !== SB_USERNAME || inputPassword !== SB_PASSWORD) {
  document.body.innerHTML = `<b>Unauthorized ${HttpStatusCode.Unauthorized}. Invalid credentials.</b>`;

  throw new Error(`Unauthorized ${HttpStatusCode.Unauthorized}. Invalid credentials.`);
}

const preview: Preview = {
  decorators: [StyleDecorator, RouterDecorator, I18nDecorator],

  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    backgrounds: {
      default: 'default',
      values: [
        {
          name: 'default',
          value: '#f9fafb',
        },
        { name: 'dark', value: '#1f2937' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  tags: ['autodocs'],
};

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', title: 'English' },
        { value: 'ru', title: 'Russian' },
        { value: 'fr', title: 'French' },
      ],
      showName: true,
    },
  },
};

export default preview;
