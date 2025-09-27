export type GenerateExternalChatLinkHandler = ({
  phoneNumber,
  isRULocale,
}: {
  phoneNumber: string;
  isRULocale: boolean;
}) => string;
