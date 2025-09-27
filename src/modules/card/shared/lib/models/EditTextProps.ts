import type { InputModel } from '@/shared';

export interface EditTextProps {
  isEditMode: boolean;
  textModel: InputModel;
  onSave: () => void;
  hideEditMode?: () => void;
}
