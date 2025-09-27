export type AddSiteFormCardNameHandlerArgs = {
  entityTypeId: number;
  entityTypeName: string;
};

export type AddSiteFormCardNameHandler = ({
  entityTypeId,
  entityTypeName,
}: AddSiteFormCardNameHandlerArgs) => void;
