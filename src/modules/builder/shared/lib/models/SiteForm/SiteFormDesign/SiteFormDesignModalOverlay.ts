export class SiteFormDesignModalOverlay {
  enabled: boolean;
  backgroundColor: string;
  opacity: number;

  constructor({ enabled, backgroundColor, opacity }: SiteFormDesignModalOverlay) {
    this.enabled = enabled;
    this.backgroundColor = backgroundColor;
    this.opacity = opacity;
  }
}
