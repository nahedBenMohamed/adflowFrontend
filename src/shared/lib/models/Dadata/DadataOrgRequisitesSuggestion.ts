import type { Nullable } from '../../types';
import type { DadataOrgRequisitesSuggestionBranchType } from './DadataOrgRequisitesSuggestionBranchType';
import type { DadataOrgRequisitesSuggestionStatus } from './DadataOrgRequisitesSuggestionStatus';
import type { DadataOrgRequisitesSuggestionType } from './DadataOrgRequisitesSuggestionType';

export interface DadataOrgRequisitesSuggestion {
  value?: Nullable<string>;
  unrestrictedValue?: Nullable<string>;
  inn?: Nullable<string>;
  kpp?: Nullable<string>;
  ogrn?: Nullable<string>;
  type?: Nullable<DadataOrgRequisitesSuggestionType>;
  name?: Nullable<{
    full?: Nullable<string>;
    short?: Nullable<string>;
  }>;
  fio?: Nullable<{
    name?: Nullable<string>;
    surname?: Nullable<string>;
    patronymic?: Nullable<string>;
  }>;
  management?: Nullable<{
    name?: Nullable<string>;
    post?: Nullable<string>;
    startDate?: Nullable<string>;
  }>;
  branchCount?: Nullable<number>;
  branchType?: Nullable<DadataOrgRequisitesSuggestionBranchType>;
  address?: Nullable<{
    unrestrictedValue?: Nullable<string>;
  }>;
  state?: Nullable<{
    registrationDate?: Nullable<string>;
    liquidationDate?: Nullable<string>;
    status?: Nullable<DadataOrgRequisitesSuggestionStatus>;
  }>;
  okato?: Nullable<string>;
  oktmo?: Nullable<string>;
  okpo?: Nullable<string>;
  okogu?: Nullable<string>;
  okfs?: Nullable<string>;
  okved?: Nullable<string>;
  employeeCount?: Nullable<number>;
  founders?: Nullable<string[]>;
  managers?: Nullable<string[]>;
  capital?: Nullable<string>;
  licenses?: Nullable<string[]>;
  phones?: Nullable<string[]>;
  emails?: Nullable<string[]>;
}
