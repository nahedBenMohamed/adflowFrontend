import type { DraggableProvided } from '@hello-pangea/dnd';
import { observer } from 'mobx-react-lite';
import { type ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import {
  GiantOutlinedInput,
  SchedulerIcon,
  type SiteFormElementsFieldModel,
} from '../../../../../../../../../shared';
import { SiteFormElementTemplate } from '../SiteFormElementTemplate/SiteFormElementTemplate';

const IconWrapper = styled.div`
  width: 24px;
  height: 24px;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  pointer-events: none;
`;

interface Props {
  fieldLabelEnabled: boolean;
  fieldPlaceholderEnabled: boolean;
  field: SiteFormElementsFieldModel;
  dragHandleProps: DraggableProvided['dragHandleProps'];
  withoutCheckboxes?: boolean;
}

const SiteFormSchedulerFieldElement = observer((props: Props) => {
  const { fieldLabelEnabled, fieldPlaceholderEnabled, field, dragHandleProps, withoutCheckboxes } =
    props;

  const { t } = useTranslation('module.builder', {
    keyPrefix:
      'builder.pages.site_form_builder_page.site_form_builder_step2.tree.entity_field_element',
  });

  const Icon = useMemo<ReactNode>(
    () => (
      <IconWrapper>
        <SchedulerIcon />
      </IconWrapper>
    ),
    []
  );

  return (
    <SiteFormElementTemplate
      field={field}
      dragHandleProps={dragHandleProps}
      fieldLabelEnabled={fieldLabelEnabled}
      withoutCheckboxes={withoutCheckboxes}
    >
      <GiantOutlinedInput
        smaller
        model={field.placeholder}
        disabled={!fieldPlaceholderEnabled}
        placeholder={t('placeholder')}
        Icon={Icon}
      />
    </SiteFormElementTemplate>
  );
});

SiteFormSchedulerFieldElement.displayName = 'SiteFormSchedulerFieldElement';
export { SiteFormSchedulerFieldElement };
