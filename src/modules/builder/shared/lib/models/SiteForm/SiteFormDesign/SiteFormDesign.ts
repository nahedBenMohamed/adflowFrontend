import type { SiteFormCustomCSS } from './SiteFormCustomCSS';
import type { SiteFormDesignClientButton } from './SiteFormDesignClientButton';
import type { SiteFormDesignFields } from './SiteFormDesignFields';
import type { SiteFormDesignFormButton } from './SiteFormDesignFormButton';
import type { SiteFormDesignFormLayout } from './SiteFormDesignFormLayout';
import type { SiteFormDesignHeader } from './SiteFormDesignHeader';
import type { SiteFormDesignModalOverlay } from './SiteFormDesignModalOverlay';

export class SiteFormDesign {
  header: SiteFormDesignHeader;
  fields: SiteFormDesignFields;
  formLayout: SiteFormDesignFormLayout;
  formButtonDesign: SiteFormDesignFormButton;
  modalOverlayDesign: SiteFormDesignModalOverlay;
  formCustomCSS: SiteFormCustomCSS;

  poweredByLogoEnabled: boolean;

  clientButtonDesign: SiteFormDesignClientButton;

  constructor({
    header,
    fields,
    formLayout,
    formButtonDesign,
    poweredByLogoEnabled,
    clientButtonDesign,
    modalOverlayDesign,
    formCustomCSS,
  }: SiteFormDesign) {
    this.header = header;
    this.fields = fields;
    this.formLayout = formLayout;
    this.formButtonDesign = formButtonDesign;
    this.poweredByLogoEnabled = poweredByLogoEnabled;
    this.clientButtonDesign = clientButtonDesign;
    this.modalOverlayDesign = modalOverlayDesign;
    this.formCustomCSS = formCustomCSS;
  }
}
