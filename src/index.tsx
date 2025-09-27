import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import 'mac-scrollbar/dist/mac-scrollbar.css';
import { configure } from 'mobx';
import { createRoot } from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import 'reflect-metadata';
import { App } from './app';
import './app/config/i18n/i18n';
import NewrelicConfig from './app/config/newrelic/newrelic';
import './app/styles/main.css';
import { MultichatProvider } from './modules/multichat';
import { TelephonyProvider } from './modules/telephony';
import { envUtil } from './shared';

declare global {
  interface Window {
    dataLayer: any;
    gtag: any;
  }
}

if (envUtil.newRelicEnabled) new BrowserAgent(NewrelicConfig);

export const queryClient = new QueryClient();

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

// this way mobx will consider all actions in methods as they are wrapped in runInAction
setTimeout(() => {
  configure({
    enforceActions: 'never',
    isolateGlobalState: true,
    reactionScheduler: f => setTimeout(f),
  });
});

root.render(
  <QueryClientProvider client={queryClient}>
    <MantineProvider>
      <TelephonyProvider>
        <MultichatProvider>
          <App />
        </MultichatProvider>
      </TelephonyProvider>
    </MantineProvider>

    {envUtil.reactQueryDevtoolsEnabled && <ReactQueryDevtools initialIsOpen={false} />}
  </QueryClientProvider>
);
