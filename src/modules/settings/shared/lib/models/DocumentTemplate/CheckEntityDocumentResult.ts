import type { CheckDocumentResultDto } from '../../../../api';
import { DocumentMissingField } from './DocumentMissingField';

export class CheckEntityDocumentResult {
  isCorrect: boolean;
  missingFields: DocumentMissingField[];
  missingTags: string[];

  constructor({ isCorrect, missingFields, missingTags }: CheckEntityDocumentResult) {
    this.isCorrect = isCorrect;
    this.missingFields = missingFields;
    this.missingTags = missingTags;
  }

  static fromDto(dto: CheckDocumentResultDto): CheckEntityDocumentResult {
    return new CheckEntityDocumentResult({
      isCorrect: dto.isCorrect,
      missingFields: DocumentMissingField.fromDtos(dto.missingFields ?? []),
      missingTags: dto.missingTags ?? [],
    });
  }
}
