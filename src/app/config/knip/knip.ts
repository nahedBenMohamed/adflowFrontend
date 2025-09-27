import type { KnipConfig } from 'knip';

// https://knip.dev/overview/configuration
const config: KnipConfig = {
  entry: ['src/index.tsx'],
  project: ['src/**/*.ts', 'src/**/*.tsx'],
  ignore: [
    'src/app/config',
    '.storybook',
    'src/shared/assets/docs-images/index.tsx',
    'src/shared/lib/hooks/useTracePropsUpdate.ts',
    'src/shared/lib/helpers/capitalizeFirstLetter.ts',
    'src/modules/scheduler/api/ScheduleAppointmentApi/queries/useGetSchedulerTotalVisits.ts',
    'src/modules/scheduler/api/ScheduleApi/helpers/invalidateScheduleInCache.ts',
    'src/modules/multichat/api/ChatProviderApi/queries/useGetExternalChatProviders.ts',
  ],
  exclude: [
    // https://github.com/webpro/knip#reading-the-report
    'enumMembers',
    'nsExports',
    'nsTypes',
    'classMembers',
  ],
  ignoreExportsUsedInFile: true,
  includeEntryExports: true,
  ignoreDependencies: [
    // deps
    'file-saver',
    '@babel/plugin-proposal-decorators',
    '@babel/plugin-transform-class-properties',
    '@babel/plugin-transform-typescript',
    '@babel/preset-typescript',
    '@emotion/react',
    '@emotion/utils',
    '@tabler/icons',
    'normalize.css',
    '@tiptap/extension-text-style',
    // dev deps
    '@storybook/blocks',
    'babel-plugin-styled-components',
    '@react-pdf-viewer/default-layout',
    // unlisted deps
    '@tanstack/table-core',
    '@tanstack/table-core',
    '@tiptap/core',
  ],
};

export default config;
