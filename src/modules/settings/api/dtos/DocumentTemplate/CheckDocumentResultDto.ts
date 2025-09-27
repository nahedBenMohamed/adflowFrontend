import type { CheckDocumentMissingFieldDto } from './CheckDocumentMissingFieldDto';

export class CheckDocumentResultDto {
  isCorrect: boolean;
  missingFields?: CheckDocumentMissingFieldDto[];
  missingTags?: string[];

  constructor({ isCorrect, missingFields, missingTags }: CheckDocumentResultDto) {
    this.isCorrect = isCorrect;
    this.missingFields = missingFields;
    this.missingTags = missingTags;
  }
}
