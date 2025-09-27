interface TinkoffButtonProps extends React.HTMLAttributes<HTMLElement> {
  size: string;
  shopId: string;
  showcaseId: string;
  'ui-data': string;
  'payment-data': string;
}

declare namespace JSX {
  interface IntrinsicElements {
    'tinkoff-create-button': TinkoffButtonProps;
  }
}
