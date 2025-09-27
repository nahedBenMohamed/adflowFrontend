import type { Nullable } from '../../types';
import type { DadataBankRequisitesOpfType } from './DadataBankRequisitesOpfType';

export interface DadataBankRequisitesSuggestion {
  value?: Nullable<string>;
  unrestrictedValue?: Nullable<string>;
  bic?: Nullable<string>;
  swift?: Nullable<string>;
  inn?: Nullable<string>;
  kpp?: Nullable<string>;
  correspondentAccount?: Nullable<string>;
  paymentCity?: Nullable<string>;
  opf?: {
    type?: Nullable<DadataBankRequisitesOpfType>;
  };
}
