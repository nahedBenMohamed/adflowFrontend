import { envUtil } from '@/shared';

const config = {
  init: {
    session_replay: {
      enabled: true,
      block_selector: '',
      mask_text_selector: '*',
      sampling_rate: 10.0,
      error_sampling_rate: 100.0,
      mask_all_inputs: true,
      collect_fonts: true,
      inline_images: false,
      inline_stylesheet: true,
      mask_input_options: {},
    },
    distributed_tracing: { enabled: true },
    privacy: { cookies_enabled: true },
    ajax: { deny_list: ['bam.eu01.nr-data.net'] },
  },
  info: {
    beacon: 'bam.eu01.nr-data.net',
    errorBeacon: 'bam.eu01.nr-data.net',
    licenseKey: envUtil.newRelicLicenseKey,
    applicationID: envUtil.newRelicApplicationId,
    sa: 1,
  },
  loader_config: {
    accountID: envUtil.newRelicAccountId,
    trustKey: envUtil.newRelicAccountId,
    agentID: envUtil.newRelicApplicationId,
    licenseKey: envUtil.newRelicLicenseKey,
    applicationID: envUtil.newRelicApplicationId,
  },
};

export default config;
